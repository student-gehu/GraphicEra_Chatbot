/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["*"],
  theme: {
    extend: {
      //here we custmise and make our own properties (make sure they will be significent not make any none sence property)
      screens:{
        xsm: '500px'
      },
      spacing:{
        13: '13px'
      },
      fontSize:{
        '10xl':['9rem', {lineHeight: '1.2'}],
      }
    },
  },
  plugins: [],
}

