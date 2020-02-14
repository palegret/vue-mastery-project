// Caveats on using filters, per the Vue.js core team:
// 
// - Filters should be used instead of methods when using that functionality 
//   exclusively in templates.
// 
// - Others argue for using methods or a computed properties instead, since its 
//   value will be cached and is a more performant option. 
// 
// - The pipe syntax that filters use behaves differently than a proposed pipe 
//   syntax for a future version of JavaScript. This may result in a future Vue 
//   app that uses pipes (|) in two different ways.


// More information on toLocaleString():
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleString

export default (value) => {
  const date = new Date(value)
  return date.toLocaleString(['en-US'], {
    month: 'short',
    day: '2-digit',
    year: 'numeric'
  })
}