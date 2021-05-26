class ElementCollection extends Array {
    ready(cb) {
        const isReady = this.some(e => {
            return e.readyState != null && e.readyState != 'loading'
        })
        if (isReady) {
            cb()
        } else {
            this.on('DOMContentLoaded',cb)
        }
        return this
    } 

    on(e, cbOrSelector, cb) {
        // If cbOrSelector is a function, then forEach function, add
        if ( typeof cbOrSelector === 'function' ) {
            this.forEach(ev => ev.addEventListener(e, cb))
        } else {
            this.forEach(elemt => {
                elemt.addEventListener(e, ev => {
                    if (ev.target.matches(cbOrSelector)) cb (ev)
                })
            })
        }
        return this
    }

    next() {
        return this.map(e => e.nextElementSibling).filter(e => e != null)
    }

    prev() {
        return this.map(e => e.previousElementSibling).filter(e => e != null)
    }

    removeClass(className) {
        this.forEach(e => e.classList.remove(className))
        return this
    }

    addClass(className) {
        this.forEach(e => e.classList.add(className))
        return this
    }
    
    css(property, value) {
        const camelProp = property.replace(/(-[a-z])/, g => {
            return g.replace('-','').toUpperCase ()
        })
        this.forEach(e => e.style[camel] = value)
        return this
    }

}

class AjaxPromise {
    constructor(promise) {
        this.promise = promise
    }

    done(cb) {
        this.promise = this.promise.then(data => {
            cb(data)
            return data
        })
        return this
    }

    fail(cb) {
        this.promise = this.promise.catch(cb)
        return this
    }

    always(cb) {
        this.promise = this.promise.finally(cb)
        return this
    }

}

const $ = (param) => {
    if (typeof param === 'string' || param instanceof String) {
        return new ElementCollection(...document.querySelectorAll(param))
    } else {
        return new ElementCollection(param)
    }
}

$.get = ({url, data = {}, success = () =>{}, dataType}) => {
    const queryString = Object.entries(data).map(([key, value]) => {
        return `${key} = ${value}`
    }).join('&')

    fetch(`${url}?${queryString}`, {
        method: 'GET',
        headers: {
            'Content-Type': dataType
        }
    }).then(res => {
        if (res.ok ) {
            return res.json()
        } else {
            throw new Error(res.status)
        }
        
    }).then(data => {
        success(data)
        return data
    })
}
