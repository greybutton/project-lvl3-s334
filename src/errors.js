import errors from 'errno';

export default (e) => {
  switch (true) {
    case e.code === errors.code.ENOENT.code:
      return `${errors.code.ENOENT.description} ${e.path}`;
    case e.code === errors.code.ECONNRESET.code:
      return `${errors.code.ECONNRESET.description} ${e.host}`;
    case !!e.response:
      return `${e.response.status} ${e.response.statusText} ${e.response.config.url}`;
    default:
      return e.message;
  }
};
