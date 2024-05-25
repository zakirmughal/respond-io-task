module.exports = function makeExpressCallback(controller, io, redisClient) {
  return (req, res) => {
    const httpRequest = {
      body: req?.body,
      query: req?.query,
      params: req?.params,
      ip: req?.ip,
      method: req?.method,
      path: req?.path,
      principal: req?.principal,
      headers: {
        'Content-Type': req.get('Content-Type'),
        'Referer': req.get('referer'),
        'User-Agent': req.get('User-Agent'),
        'x-hub-signature-256': req.get('x-hub-signature-256'),
      }
    };

    controller(httpRequest, io, redisClient)
      .then(httpResponse => {
        res.set('Content-Type', 'application/json');
        res.type('json');
        // const body = {
        //   success: true,
        //   data: httpResponse
        // }
        res.status(200).send(httpResponse)
      })
      .catch(e => {
        console.log(e);
        res.status(400).send({
          success: false,
          error: {
            code: 400,
            description: e.message
          }
        })
      })
  }
};
