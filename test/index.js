var expect = require('chai').expect,
  poParser = require('gettext-parser'),
  fs = require('fs'),
  path = require('path'),
  _ = require('lodash');

function filemap(files) {
  return _.reduce(files, function(memo, file) {
    memo[file] = fs.readFileSync(path.join(__dirname, file), 'utf-8');
    return memo;
  }, {});
}

describe('pocreate', function() {
  beforeEach(function() {
    this.instance = require('..');
    this.options = {
      keyword: ['tr'],
      add_comments: '/'
    };
  });

  it('should have a parse method', function() {
    expect(this.instance.parse).to.be.a('function');
  });

  it('parse should throw an error with improper arguments', function() {
    expect(function() {
      this.instance.parse();
    }).to.throw(Error);

    expect(function() {
      this.instance.parse([]);
    }).to.throw(Error);

    expect(this.instance.parse([], [])).to.be.an('object');
  });

  it('parse should add a key found in the .js to the .po that is missing it', function() {
    var poFilename = path.join('fixtures', 'missing_key_in_po.po');
    var pos = filemap([poFilename]);
    var src = filemap([path.join('fixtures', 'missing_key_in_po.js')]);
    var resultPos = this.instance.parse(pos, src, this.options);
    var parsed = poParser.po.parse(resultPos[poFilename]);

    expect(resultPos[poFilename]).to.be.a('string');
    expect(parsed.translations['']['Key 2']).to.be.an('object');
    expect(parsed.translations['']['Key 2'].msgid).to.equal('Key 2');
    expect(parsed.translations['']['Key 2'].msgstr).to.be.instanceof(Array);
    expect(parsed.translations['']['Key 2'].msgstr[0]).to.equal('');
  });

  it('parse should do nothing if they key already exists', function() {
    var poFilename = path.join('fixtures', 'existing_key_in_po.po');
    var pos = filemap([poFilename]);
    var src = filemap([path.join('fixtures', 'missing_key_in_po.js')]);
    var resultPos = this.instance.parse(pos, src, this.options);
    var parsed = poParser.po.parse(resultPos[poFilename]);

    expect(resultPos[poFilename]).to.be.a('string');
    expect(parsed.translations['']['Key 2'].msgstr).to.be.instanceof(Array);
    // Don't replace the existing key
    expect(parsed.translations['']['Key 2'].msgstr[0]).to.equal('Key 2');
  });
});
