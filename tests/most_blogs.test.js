const listHelper = require('../utils/list_helper')

describe('most blogs', () => {
    const listWithManyBlogs = [
        {
            _id: '5a422aa71b54a676234d17f8',
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
            likes: 5,
            __v: 0
        },
        {
            _id: '7a422aa71b54a676234d17f9',
            title: 'Ruokablogi',
            author: 'Ihanat tomaatit',
            url: 'http://tomaatit.com',
            likes: 8,
            __v: 1
        },
        {
            _id: '8e222aa71b54a676234d17f9',
            title: 'Eläinblogi',
            author: 'Jesse James',
            url: 'http://elain.com',
            likes: 454,
            __v: 2
        },
        {
            _id: '1f422aa71b54a676234d17f9',
            title: 'Outlaw-blogi',
            author: 'Jesse James',
            url: 'http://outlaw.com',
            likes: 1222,
            __v: 3
        },
        {
            _id: 'y6y62aa71b54a676234d17f9',
            title: 'Colt-blogi',
            author: 'Jesse James',
            url: 'http://bangbang.com',
            likes: 654,
            __v: 4
        }
    ]

    test('author with bost blogs', () => {
        const result = listHelper.mostBlogs(listWithManyBlogs)
        expect(result).toEqual({author: "Jesse James", blogs: 3})
    })
})