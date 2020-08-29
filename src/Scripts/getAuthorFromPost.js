import React from 'react' //React so anonymous submission can be italics
export default function getAuthorFromPost(post) {
    let writtenByIndex = post.content.indexOf("Written by: ")
    let authorInContent = post.content.substring(writtenByIndex+"Written by:".length, post.content.indexOf(";")).trim()
    if(writtenByIndex!=-1 && authorInContent)
        return authorInContent
    let nameFromMetaData = post.author.first_name+" "+post.author.last_name
    if(nameFromMetaData)
        return nameFromMetaData
    return <em>Anonymous Submission</em>
}