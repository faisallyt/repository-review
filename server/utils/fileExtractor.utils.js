const array=[];

function fileExtractor(directory){
    for(let i=0;i<directory.length;i++){
        if(directory[i].type==="file"){
            const obj={
                "name":directory[i].name,
                "path":directory[i].path,
                "type":"file",
            }
            array
        }
        else{
            const obj={
                "name":directory[i].name,
                "path":directory[i].path,
                "type":"directory",
                "children":fileExtractor(directory[i].children)
            }
        }
    }
}

module.exports = fileExtractor;