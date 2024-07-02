var files = 'https://cs.deo.shopeemobile.com/shopee/shopee-cschannel-live-vn/livechatfe/pc/static/js/runtime-pc.0f07e443.js,https://cs.deo.shopeemobile.com/shopee/shopee-cschannel-live-vn/livechatfe/pc/static/css/2.1a4b918d.chunk.css,https://cs.deo.shopeemobile.com/shopee/shopee-cschannel-live-vn/livechatfe/pc/static/js/2.56047dbc.chunk.js,https://cs.deo.shopeemobile.com/shopee/shopee-cschannel-live-vn/livechatfe/pc/static/css/pc.75c31ad6.chunk.css,https://cs.deo.shopeemobile.com/shopee/shopee-cschannel-live-vn/livechatfe/pc/static/js/pc.685a62f3.chunk.js'

function createAssetScriptTags(fileNames) {
  var files = fileNames.split(',')
  var fileLength = files.length
  var fragment = document.createDocumentFragment()
  if (fileLength) {
    for (var i = 0; i < fileLength; i++) {
      var jsFile = files[i].indexOf('js') > -1
      var cssFile = files[i].indexOf('css') > -1
      var fileUrl = files[i]
      if (jsFile) {
        var jstag = document.createElement('script')
        jstag.src = fileUrl
        jstag.type = 'text/javascript'
        jstag.charset = 'utf-8'
        if (jstag) {
          fragment.appendChild(jstag)
        }
      } else if (cssFile) {
        var csstag = document.createElement('link')
        csstag.href = fileUrl
        csstag.rel = 'stylesheet'
        csstag.type = 'text/css'
        if (csstag) {
          fragment.appendChild(csstag)
        }
      }
    }
    document.body.appendChild(fragment)
  }
}
// Load static resources
createAssetScriptTags(files)
