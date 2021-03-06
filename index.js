'use strict'
const EventEmitter = require('events')

function concatStreams (streams, events) {
  if (!streams || !Array.isArray(streams)) throw new Error(`Invaild stream array: ${streams}`)
  if (!events) events = ['error']
  if (!Array.isArray(events)) events = [events]

  streams = streams.filter(isStream)

  for (let i = 0; i < streams.length - 1; i++) {
    let stream = streams[i]
    let nextStream = streams[i + 1]

    for (let event of events) {
      stream.on(event, function () {
        nextStream.emit.apply(nextStream, [event].concat(Array.prototype.slice.call(arguments)))
      })
    }

    stream.pipe(nextStream)
  }

  return last(streams)
}

function isStream (stream) {
  return (stream && typeof stream === 'object' && typeof stream.pipe === 'function' && stream instanceof EventEmitter)
}

function last (array) {
  if (array.length === 0) return null

  return array[array.length - 1]
}

module.exports = concatStreams
