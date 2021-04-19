const range= (size, startAt) => {
    return [...Array(size).keys()].map(i => i + startAt);
}
module.exports = {
    createPageRange: (curPage, maxPage)=>{
        var pageRange = range(5, curPage-2)
        var start = pageRange.indexOf(1)
        var end = pageRange.indexOf(maxPage)
        if (start === -1 && end === -1){
            return pageRange
        }else if (start === -1){
            return pageRange.slice(0,end+1)
        }else if (end === -1){
            return pageRange.slice(start,)
        }else{
            return pageRange.slice(start, end+1)
        }
    },
    removeTo: (value, target) => {
        while (target.indexOf(value)!=-1){
            target.splice(0,1)
        }
        return target
    },
}