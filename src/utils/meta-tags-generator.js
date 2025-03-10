import isEqual from 'react-fast-compare'

const domain = 'stellar.broker'
const serviceTitle = 'StellarBroker'

function getCanonicalUrl() {
    const {origin, pathname, search} = window.location
    return origin + pathname + search
}

function formatPageTitle(title) {
    if (!title) return serviceTitle
    if (title.includes(serviceTitle)) return title
    return `${title} | ${serviceTitle}`
}

function generateCanonicalLink() {
    return {
        tag: 'link',
        locator: 'rel',
        tags: [
            {name: 'canonical', content: getCanonicalUrl(), attribute: 'href'}
        ]
    }
}

function generateDescriptionMeta({description}) {
    return {
        locator: 'name',
        tags: [
            {name: 'description', content: description}
        ]
    }
}

function generateOpenGraphMeta({description, title, image}) {
    let tags = [
        {name: 'og:title', content: formatPageTitle(title)},
        {name: 'og:url', content: getCanonicalUrl()},
        {name: 'og:site_name', content: formatPageTitle(serviceTitle)},
        {name: 'og:description', content: description},
        {name: 'og:type', content: 'website'}
    ]
    if (image) {
        tags.push({name: 'og:image', content: image})
    }
    return {
        locator: 'property',
        tags
    }
}

function generateLdJsonSchema({title}) {
    return {
        tag: 'script',
        locator: 'type',
        tags: [
            {
                name: 'application/ld+json',
                content: JSON.stringify({
                    '@context': 'http://schema.org',
                    '@type': 'WebSite',
                    'name': domain,
                    'alternateName': title,
                    'url': window.location.origin
                })
            }
        ]
    }
}

function replaceMetaTags({tag, tags, locator}) {
    const selector = tag || 'meta'
    tags.forEach(tagSettings => {
        let tag = document.querySelector(selector + '[' + locator + '="' + tagSettings.name + '"]')
        if (!tag) {
            tag = createTag(selector)
            tag.setAttribute(locator, tagSettings.name)
        }
        if (selector === 'meta') {
            tag.content = tagSettings.content
        } else if (tagSettings.attribute) {
            tag[tagSettings.attribute] = tagSettings.content
        } else {
            tag.innerText = tagSettings.content
        }
    })
}

function createTag(tagName, props) {
    let tag = document.createElement(tagName)
    for (let key in props) {
        tag[key] = props[key]
    }
    document.head.appendChild(tag)
    return tag
}

function removeTag(selector) {
    let tag = document.querySelector(selector)
    if (tag) {
        tag.parentElement.removeChild(tag)
    }
}

let pageMeta = {}

/**
 * Update page metadata tags.
 * @param params
 * @param {string} params.title - Page title.
 * @param {string} params.description - Page contents description.
 * @param {object} [params.customMeta] - Custom metadata tags.
 */
export function setPageMetadata(params) {
    if (isEqual(pageMeta, params)) return
    setPageTitle(params.title);
    ([
        generateCanonicalLink(params),
        generateDescriptionMeta(params),
        generateOpenGraphMeta(params),
        generateLdJsonSchema(params)
    ]).forEach(replaceMetaTags)

    if (params.customMeta) {
        replaceMetaTags(params.customMeta)
    }
    pageMeta = params
}

export function setPageTitle(title) {
    document.title = formatPageTitle(title)
}

export function setPageNoIndex(noIndex) {
    if (!noIndex) {
        removeTag('meta[name=robots]')
    } else {
        replaceMetaTags({
            locator: 'name',
            tags: [
                {name: 'robots', content: 'noindex,nofollow'}
            ]
        })
    }
}