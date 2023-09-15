import Button from '@/layout/button';
import { useRouter } from 'next/router';

export default function Pagination({
    totalPagesCount, 
    currentPage,
    search
}:{
    totalPagesCount: number
    currentPage: number
    search: (value:string[][]) => void
}) {
    const {page: current} = useRouter().query
    let paging = [];
    for(let i=0; i<totalPagesCount; i++) {
        paging.push(i+1)
    }
    return (
        <div className='flex justify-center items-center gap-4 py-10'>
            <Button styleType='dimmend' className='w-24 relative'
            onClick={() => search([['page', '1']])} 
            inlineCSS={`
                text-indent:-1000em;background:#fff;
                &:before {
                    content:'';position:absolute;top:0;left:0;right:0;bottom:0;transform: rotate(90deg);opacity: .5;
                    background: url(/images/icon-arrow-down.svg) no-repeat 50% 50%;background-size: 50%;
                }
            `}>1</Button>
            {paging.filter((page) => {
                if(currentPage < 3 && page < 6) return page
                else if (page > currentPage - 3 && page < currentPage + 3) return page
            }).map((page) => (
                <Button styleType={Number(current) === page ? 'primary':'dimmend'} key={page}
                    onClick={() => search([['page', String(page)]])}     
                    className='min-w-[6rem] font-normal'
                    inlineCSS={`background:${Number(current) === page ? 'var(--pointColor)' :'#fff'};`}
                >{page}</Button>
            ))}
            <Button styleType='dimmend' className='w-24 relative'
            onClick={() => search([['page', String(totalPagesCount)]])} 
            inlineCSS={`
                text-indent:-1000em;background:#fff;
                &:before {
                    content:'';position:absolute;top:0;left:0;right:0;bottom:0;transform: rotate(-90deg);opacity: .5;
                    background: url(/images/icon-arrow-down.svg) no-repeat 50% 50%;background-size: 50%;
                }
            `}>{totalPagesCount}</Button>
        </div>
    );
  }