const listHelper = require('../utils/list_helper')

describe('favorite blog', () => {
    const listWithTwoBlogs = [
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
        }
    ]

    test('most likes amount', () => {
        const result = listHelper.favoriteBlog(listWithTwoBlogs)
        expect(result).toEqual({title: 'Ruokablogi', author: 'Ihanat tomaatit', likes: 8})
    })
})