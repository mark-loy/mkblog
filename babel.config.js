module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: [
    ["prismjs", {
      "languages": ["javascript", "jq", "css", "less", "xml-doc", "yaml", "markdown", "nginx", "markup", "html", "java", "javadoc", "sql", "git", "icon"],
      "plugins": ["line-numbers","highlight-keywords","jsonp-highlight","previewers"],
      "theme": "tomorrow",
      "css": true
    }]
  ]
}

