const files = require.context('.', false, /\.svg$/);
const eyes = files.keys().map(files);

export default eyes;