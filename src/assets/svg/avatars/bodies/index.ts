const files = require.context('.', false, /\.svg$/);
const bodies = files.keys().map(files);

export default bodies;