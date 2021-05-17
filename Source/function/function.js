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

    parseQuery: (data) => {
        return {
            title: {$regex:new RegExp(data.keyword, "i")},
            authorId: data.userId==="undefined"?undefined:data.userId,
            isSale: data.isSale === "any"||!data.isSale?undefined:data.isSale==='sale',
            type:  data.type === "any"||!data.type?undefined:data.type,
            'location.cityId':  data.city === "any"||!data.city?undefined:data.city,
            'location.districtId': data.district === "any"||!data.district?undefined: data.district,
            area: data.areaFrom&&data.areaTo?{
                $gte: Number(data.areaFrom),
                $lte: Number(data.areaTo)
            }:undefined,
            price: data.priceFrom&&data.priceTo?{
                $gte: Number(data.priceFrom),
                $lte: Number(data.priceTo)
            }:undefined,
            'features.rooms': data.rooms === "any"||!data.rooms?undefined:data.rooms === "more"?{$gte: 5}:data.rooms,
            'features.floors': data.floors === "any"||!data.floors?undefined:data.floors === "more"?{$gte: 5}:data.floors,
            'features.bathrooms': data.bathrooms === "any"||!data.bathrooms?undefined:data.bathrooms === "more"?{$gte: 5}:data.bathrooms,
            'features.bedrooms': data.bedrooms === "any"||!data.bedrooms?undefined:data.bedrooms === "more"?{$gte: 5}:data.bedrooms,
            status: data.status==="false"?false:true
        }
    },

    parseSort: (data) => {
        var sortBy = {}
        if(data.sortPrice === "asc-price"){
            sortBy = {...sortBy,price: 1}
        }else if(data.sortPrice === "desc-price"){
            sortBy = {...sortBy,price: -1}
        }

        if(data.sortArea === "asc-area"){
            sortBy = {...sortBy,area: 1}
        }else if(data.sortArea === "desc-area"){
            sortBy = {...sortBy,area: -1}
        } 

        if(data.sortDate === "asc-date"){
            sortBy = {...sortBy,date: 1}
        }else if(data.sortDate === "desc-date"){
            sortBy = {...sortBy,date: -1}
        }
        return sortBy
    },
    
    alphaAndSpace : (string)=> {
        for (i = 0; i < string.length; i++ ) {
            var key = string.charCodeAt(i)
            if ((key >= 33 && key <= 64) || (key >= 91 && key <= 96) || (key >= 123 && key <= 126)){
                return false
            }
        }
        return true
      }
}