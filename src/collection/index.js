/** 1. 实现搜索富文本信息的高亮功能
 * @Question 用户搜索标签名、标签括号、图片后缀（.png .jpg等）,若按常规的正则替换就会出现替换掉有意义的信息
 * @Methods 通过标签选择富文本信息 然后再替换文本信息
 */
/**转一下正则特殊意义的符号 （$&） */
const CUSTOM_REG = (keyword) => new RegExp(keyword.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'))

/**
 * 实现替换的具体方法
 * @param {String} node 富文本信息
 * @param {*} keyword 用户搜索的关键字
 * @param {*} isReplace 是否替换特殊正则符号
 */
const replaceTextFun = (node, keyword, isReplace = true) => {
  if (!node) return
  if (isReplace) keyword = CUSTOM_REG(keyword)
  if (node.nodeType === 3) {
    //只处理文本节点
    const match = node.data.match(new RegExp(keyword))
    if (match) {
      const highlightEl = document.createElement('font')

      highlightEl.dataset.highlight = 'yes' // 标记该节点是否经过高亮处理 循环处理的时候不处理标记过的内容

      highlightEl.setAttribute('class', 'high-light') // 预设的高亮class

      const wordNode = node.splitText(match.index)

      wordNode.splitText(match[0].length) // 切割成前 关键词 后三个Text 节点

      const wordNew = document.createTextNode(wordNode.data)

      highlightEl.appendChild(wordNew) //highlight 节点构建成功

      wordNode.parentNode.replaceChild(highlightEl, wordNode) // 替换该文本节点
    }
  } else if (node.nodeType === 1 && node.dataset.highlight != 'yes') {
    for (let i = 0; i < node.childNodes.length; i++) {
      replaceTextFun(node.childNodes[i], keyword, false)
    }
  }
}
