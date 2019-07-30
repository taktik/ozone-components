
function setup(app){
    app.get('ozone/rest/v3/items/video/00000000-0000-0000-0000-000000000003', function(req, res) {
        res.json({
            derivedFiles:
                ["00000000-0000-0000-0000-000000000004"],
            file: "00000000-0000-0000-0000-000000000005",
            id: "00000000-0000-0000-0000-000000000003",
            name: "Big_Bunny_43.m4v",
            subTitles:{ "en": "00000000-0000-0000-0000-000000000002","pl": "00000000-0000-0000-0000-000000000001"}
        });
    });
      app.post('ozone/rest/v3/items/file/bulkGet', function(req, res) {
        res.json([{
          fileType: "ffffffff-2",
          id: "00000000-0000-0000-0000-000000000005",
          type: "file",
        },{
          fileType: "ffffffff-1",
          id: "00000000-0000-0000-0000-000000000004",
          type: "file",
        }]);
      });
      app.get('ozone/rest/v3/filetype/identifier/org.taktik.filetype.video.hls', function(req, res) {
        res.json({
          id: "ffffffff-1",
          identifier : "org.taktik.filetype.video.hls"
        });
      });
      app.post('/rest/v3/items/mediaplay/send', function(req, res) {
        res.json({message: "ok"});
      });
}

module.exports = setup;
