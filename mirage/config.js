import { Response } from 'ember-cli-mirage'
import moment       from 'moment'

const { parse } = JSON

export default function() {
  this.passthrough('/write-coverage')

  this.urlPrefix = ''
  this.namespace = '/api/v1'
  this.timing    = 400

  this.post('/auth/login', ({ users }, req) => {
    let { data: { attributes: { username, password } } } = parse(req.requestBody)

    let { models: [ user ] } = users.where({ username, password })

    if (!user) {
      return new Response(400, {})
    }

    let exp     = new Date().getTime() + 30 * 60 * 60 // now plus 30 days
    let payload = `{"user_id":${user.id},"exp":${exp}}`

    return new Response(200, {}, { data: {
      token: `${btoa('foo')}.${btoa(payload)}.${btoa('pony')}` }
    })
  })

  this.post('/auth/refresh', ({ db }, req) => {
    let { token } = parse(req.requestBody)

    return new Response(200, {}, { data: { token } })
  })

  this.get('/attendances', function({ attendances }, { queryParams: { day } }) {
    return attendances.where((a) => {
      return moment(a.fromDatetime).format('YYYY-MM-DD') === day
    })
  })
  this.post('/attendances')
  this.get('/attendances/:id')
  this.patch('/attendances/:id')
  this.del('/attendances/:id')

  this.get('/activities', function({ activities, activityBlocks }, { queryParams: { active } }) {
    if (active) {
      return activities.where((a) => {
        let blocks = activityBlocks.where((b) => b.activityId === a.id).models

        return blocks.any((b) => !b.toDatetime)
      })
    }

    return activities.all()
  })
  this.post('/activities')
  this.get('/activities/:id')
  this.patch('/activities/:id')
  this.del('/activities/:id')

  this.get('/reports', function({ reports }, { queryParams: { day } }) {
    return reports.where((r) => {
      return moment(r.date).format('YYYY-MM-DD') === day
    })
  })
  this.post('/reports')
  this.get('/reports/:id')
  this.patch('/reports/:id')
  this.del('/reports/:id')

  this.get('/activity-blocks')
  this.post('/activity-blocks', function({ activityBlocks }) {
    let attrs = this.normalizedRequestAttrs()

    return activityBlocks.create({ ...attrs, fromDatetime: moment().format() })
  })
  this.get('/activity-blocks/:id')
  this.patch('/activity-blocks/:id')
  this.del('/activity-blocks/:id')

  this.get('/customers')
  this.post('/customers')
  this.get('/customers/:id')
  this.patch('/customers/:id')
  this.del('/customers/:id')

  this.get('/projects')
  this.post('/projects')
  this.get('/projects/:id')
  this.patch('/projects/:id')
  this.del('/projects/:id')

  this.get('/tasks')
  this.post('/tasks')
  this.get('/tasks/:id')
  this.patch('/tasks/:id')
  this.del('/tasks/:id')

  this.get('/users')
  this.post('/users')
  this.get('/users/:id')
  this.patch('/users/:id')
  this.del('/users/:id')

  this.get('/public-holidays', function({ locations }, { queryParams: { date } }) {
    if (date) {
      locations.where((l) => {
        return l.format('YYYY-MM-DD') === date
      })
    }

    return locations.all()
  })
  this.post('/public-holidays')
  this.get('/public-holidays/:id')
  this.patch('/public-holidays/:id')
  this.del('/public-holidays/:id')

  this.get('/locations')
  this.post('/locations')
  this.get('/locations/:id')
  this.patch('/locations/:id')
  this.del('/locations/:id')

  this.get('/employments')
  this.post('/employments')
  this.get('/employments/:id')
  this.patch('/employments/:id')
  this.del('/employments/:id')
}
