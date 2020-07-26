const BLOCK_KEYWORDS = [
    
]

let current = window.location.href
for (let blockKeyword of BLOCK_KEYWORDS) {
    if(current.includes(blockKeyword)) {
        document.documentElement.innerHTML = ''
        document.documentElement.innerHTML = 'Domain is blocked'
        document.documentElement.scrollTop = 0
        break
    }
}
  