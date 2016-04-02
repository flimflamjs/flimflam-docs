import R from 'ramda'
import uuid from 'uuid'

// Pass in task data, and this will merge in defaults
function createTask(task) {
  return R.merge({
    id: uuid.v1()
  , createdAt: new Date()
  , hidden: false
  }, task)
}

module.exports = createTask
