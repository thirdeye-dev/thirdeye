import nookies from 'nookies'

export default (req, res) => {
  const { access, refresh } = req.query

  nookies.set(res, 'access_token', access, {
    maxAge: 30 * 24 * 60 * 60,
    path: '/',
  })

  nookies.set(res, 'refresh_token', refresh, {
    maxAge: 30 * 24 * 60 * 60,
    path: '/',
  })

  res.writeHead(302, {
    Location: '/dashboard/servers',
  })

  res.end()
}