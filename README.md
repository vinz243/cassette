# cassette

![](https://travis-ci.org/vinz243/cassette.svg?branch=master) [![Coverage Status](https://coveralls.io/repos/github/vinz243/cassette/badge.svg?branch=master)](https://coveralls.io/github/vinz243/cassette?branch=master)

Cassette is music manager supporting major torrents site to download, sync and stream tracks on-the-go :headphones:



### Roadmap and planned features

(written for myself)

 - Music database provider searching (spotify) for getting correct metadata.
 - Release searching (t411, alphaRatio, Youtube):
   - Support different provider using an Abstraction Layer.
   - Release score calculation:
     - Format
     - Bitrate
     - Provider
     - Peers
 - Communicate with torrent client
   - Send torrent file
   - Wait for download end
 - [ ] Scan music library:
   - [ ] Read and parse ID3 tags
   - [ ] Try to tag using file name
   - [ ] Last resort, use AcoustID
 - [ ] Expose API for accessing library
  - [ ] List tracks and artists
  - [ ] Search artists
  - [ ] Stream music
  - [ ] Download music
