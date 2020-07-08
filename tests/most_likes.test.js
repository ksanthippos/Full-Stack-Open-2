const listHelper = require('../utils/list_helper')

describe('most likes', () => {
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
            title: 'Hevosblogi',
            author: 'Jesse James',
            url: 'http://ihhahhaa.com',
            likes: 3,
            __v: 2
        },
        {
            _id: '1f422aa71b54a676234d17f9',
            title: 'Outlaw-blogi',
            author: 'Jesse James',
            url: 'http://outlaw.com',
            likes: 12,
            __v: 3
        },
        {
            _id: 'y6y62aa71b54a676234d17f9',
            title: 'Colt-blogi',
            author: 'Jesse James',
            url: 'http://bangbang.com',
            likes: 13,
            __v: 4
        }
    ]

    test('author with most (total) likes', () => {
        const result = listHelper.mostLikes(listWithManyBlogs)
        expect(result).toEqual({author: "Jesse James", likes: 28})
    })
})