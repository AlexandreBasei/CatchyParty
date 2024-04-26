const files = require.context('.', false, /\.svg$/);
const mouths = files.keys().map(files);

export default mouths;