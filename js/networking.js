function getRequest(url) {
    return new Promise(function(resolve, reject) {
        var xhr = new XMLHttpRequest()
        xhr.open('GET', url)
        xhr.onload = function() {
            if (this.status >= 200 && this.status < 300) {
                resolve(xhr.response)
            } else {
                reject({
                    status: this.status,
                    statusText: xhr.statusText
                })
            }
        }
        xhr.send()
    })
}

function postRequest(url, data) {
    return new Promise(async function(resolve, reject) {
        let paramString = ""
        for (let key in data) {
            paramString += `${key}=${encodeURIComponent(data[key])}&`
        }
        paramString = paramString.slice(0, -1)
        // using fetch
        let response = await fetch(url, {
            method: "POST",
            body: new URLSearchParams(paramString)
        })
        if (response.status >= 200 && response.status < 300) {
            resolve()
        } else {
            reject()
        }
    })
}
