'use strict'

const fs = require('fs')
const path = require('path')
const expect = require('chai').expect
const Vinyl = require('vinyl')

const myPlugin = require('..')
const { name } = require('../package.json')
const PLUGIN_NAME = name

const getFile = file => {
  const filePath = path.join(__dirname, file)

  return new Vinyl({
    base: path.dirname(filePath),
    path: filePath,
    contents: fs.readFileSync(filePath)
  })
}

const compare = (stream, fixture, expected, done, expectedErr) => {
  stream.on('error', err => {
    if (expectedErr) {
      expect(err.message).to.equal(expectedErr)
      done()
      return
    }
    done(err)
  })

  stream.on('data', file => {
    expect(file.contents.toString()).to.equal(
      getFile(expected).contents.toString()
    )
    done()
  })

  stream.write(getFile(fixture))
  stream.end()
}

describe(PLUGIN_NAME, () => {
  it('works for me', done => {
    compare(myPlugin(), 'world', 'hello_world', done)
  })

  it('throws an error', done => {
    compare(myPlugin(), 'long_world', 'no_file', done, 'Name too long')
  })
})
