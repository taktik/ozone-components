
export class OzoneApiItem {
  on (){
    return this
  }
  getOne (id) {
    expect(id).to.equal('00000000-046c-7fc4-0000-000000006028')
    return {id: '00000000-046c-7fc4-0000-000000006028', file: 'f1', derivedFiles: ['f2', 'f3']}
  }
  bulkGet (ids) {
    expect(ids).to.deep.equal(['f1', 'f2', 'f3'])
    return [{
      fileType :'fileType'
    }]
  }
}