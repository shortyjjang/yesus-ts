import Button from '@/layout/button'
import Select from '@/components/input/select'
import dayjs from "dayjs"
import { useRouter } from 'next/router'
import { useState } from 'react'

export default function SearchBoard({
    search,
    defaultDate = 'all',
    defaultSearchType = 'title',
    defaultKeyword = ''
}:{
    search: (value: string[][]) => void
    defaultDate?: string
    defaultSearchType?: string
    defaultKeyword?: string
}) {
    const router = useRouter()
    const [date, setDate] = useState(defaultDate)
    const [searchType, setSearchType] = useState(defaultSearchType)
    const [keyword, setKeyword] = useState(defaultKeyword)
    const setValue = () => {
        let value = []
        value.push(['endDate', date])
        value.push(['page', '1'])
        if(searchType !== 'title+contents' && keyword) value.push([searchType, keyword])
        if(searchType === 'title+contents' && keyword) {
            value.push(['title', keyword])
            value.push(['contents', keyword])
        }
        if(value.length > 0) search(value)
    }
    return (
        <>
            <div className='flex gap-4 py-4'>
                <Select options={
                    [['전체','all'],['일주일',dayjs().add(-1, 'weeks').format('YYYY-MM-DD hh:mm:ss')],['한달',dayjs().add(-1, 'month').format('YYYY-MM-DD hh:mm:ss')]]
                } setValue={(e) => setDate(e.target.value)} value={date} className='w-full' size="default"/>
                <Select options={
                    [['제목','title'],['내용','contents'],['제목+내용','title+contents']]
                } setValue={(e) => setSearchType(e.target.value)} value={searchType} className='w-full' size="default" />
            </div>
            <div className='flex gap-4 justify-between'>
                <input type="text" 
                    onChange={(e) => setKeyword(e.target.value)} 
                    value={keyword}
                    onKeyDown={(e) => e.key === 'Enter' && setValue()}
                    className='w-full border border-solid border-gray-300 px-4'
                />
                <div className='whitespace-nowrap'>
                    <Button onClick={setValue} size="sm">검색</Button>
                    {Object.keys(router.query).length > 0 && <Button onClick={setValue} size="sm" styleType='dimmend'>전체보기</Button>}
                </div>
            </div>
        </>
    )
}
