import { expect } from 'chai'
import { describe, it } from 'mocha'
import { setupComponentTest } from 'ember-mocha'
import hbs from 'htmlbars-inline-precompile'
import testSelector from 'ember-test-selectors'

describe('Integration | Component | record button', function() {
  setupComponentTest('record-button', {
    integration: true
  })

  it('renders', function() {
    this.render(hbs`{{record-button}}`)
    expect(this.$(testSelector('record-stop'))).to.have.length(0)
  })

  it('can stop', function() {
    this.set('recording', true)

    this.on('stop', () => {
      this.set('recording', false)

      expect(this.$(testSelector('record-stop'))).to.have.length(0)
    })

    this.render(hbs`{{record-button recording=recording stop=(action 'stop')}}`)

    this.$(testSelector('record-stop')).click()
  })

  it('can start', function() {
    this.set('recording', false)

    this.on('start', () => {
      this.set('recording', true)

      expect(this.$(testSelector('record-stop'))).to.have.length(1)
    })

    this.render(hbs`{{record-button recording=recording start=(action 'start')}}`)

    this.$(testSelector('record-start')).click()
  })

  it('can pause', function() {
    this.set('recording', true)
    this.set('paused', false)

    this.on('pause', () => {
      this.set('recording', false)
      this.set('paused', true)

      expect(this.$(testSelector('record-stop'))).to.have.length(1)
    })

    this.render(hbs`{{record-button paused=paused recording=recording pause=(action 'pause')}}`)

    this.$(testSelector('record-start')).click()
  })
})
