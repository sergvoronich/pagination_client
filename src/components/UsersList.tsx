'use client'
import { Alert, Pagination, Table } from "react-bootstrap";
import { TUserItem } from '@/pages/index'
import { Fragment, useEffect, useState } from "react";

const PAGE_RANGE_DISPLAYED = 10

function UsersList() {
    const [pages, setPages] = useState([1])
    const [allPages, setAllPages] = useState([[1]])
    const [currentPage, setCurrentPage] = useState(1);
    const [total, setTotal] = useState(1);
    const [users, setUsers] = useState<TUserItem[]>([]);
    const [error, setError] = useState(0);
    const pageCount = Math.ceil(total / 20)

    const createPaginationArray = (
        arLength: number,
        PAGE_RANGE_DISPLAYED: number
    ) => {
        let initial: number[] = []
        let result: number[][] = []
        for (let i = 0; i < arLength; i++) {
            initial.push(i + 1)
        }
        const chunksCount = Math.ceil(initial.length / PAGE_RANGE_DISPLAYED)
        for (let i = 0; i < chunksCount; i++) {
            const chunk = initial.slice(
                i * PAGE_RANGE_DISPLAYED,
                i * PAGE_RANGE_DISPLAYED + PAGE_RANGE_DISPLAYED
            )
            result.push(chunk)
        }
        return result
    }

    const onNextClick = () => {
        setPages(
            (prev) =>
                allPages[allPages.findIndex((el) => el.includes(currentPage)) + 1] || prev
        )
        if (pages[pages.length - 1] !== pageCount) {
            setCurrentPage(pages[PAGE_RANGE_DISPLAYED - 1] + 1)
        }
    }

    const onPrevClick = () => {
        setPages(
            (prev) =>
                allPages[allPages.findIndex((el) => el.includes(currentPage)) - 1] || prev
        )
        if (pages[0] !== 1) {
            setCurrentPage(pages[0] - 1)
        }
    }

    const onStartClick = () => {
        setPages(allPages[0])
        setCurrentPage(1)
    }

    const onEndClick = () => {
        setPages(allPages[allPages.length - 1])
        setCurrentPage(pageCount)
    }

    useEffect(() => {
        const getUsersData = async () => {
            try {
                const res = await fetch(`http://localhost:3000/users?page=${currentPage}`, { method: 'GET' })
                if (!res.ok) {
                    setError(res.status)
                }
                if (res.ok) {
                    const response: { usersList: TUserItem[], total: number } = await res.json()
                    setUsers(response.usersList || [])
                    setTotal(response.total || 1)
                    setAllPages(createPaginationArray(response.total || 1, PAGE_RANGE_DISPLAYED))
                }
            } catch (e) {
                setError(500)
            }
        }
        getUsersData()
    }, [currentPage])

    useEffect(() => {
        if (!allPages.find((el) => el.includes(currentPage))) {
            setCurrentPage(1)
        }
        setPages(allPages.find((el) => el.includes(currentPage)) || allPages[0])
    }, [allPages, currentPage, pages])

    if (error) {
        return <Alert variant={'danger'}>Ошибка {error} при загрузке данных</Alert>
    }

    return (
        <Fragment>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Имя</th>
                        <th>Фамилия</th>
                        <th>Телефон</th>
                        <th>Email</th>
                        <th>Дата обновления</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        users.map((user) => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.firstname}</td>
                                <td>{user.lastname}</td>
                                <td>{user.phone}</td>
                                <td>{user.email}</td>
                                <td>{user.updatedAt}</td>
                            </tr>
                        ))
                    }
                </tbody>
            </Table>

            <Pagination>
                <Pagination.First onClick={onStartClick} />
                <Pagination.Prev onClick={onPrevClick} />
                {pages.map(page =>
                    <Pagination.Item
                        active={page === currentPage}
                        onClick={() => setCurrentPage(page)}
                        key={page}
                    >
                        {page}
                    </Pagination.Item>)}
                <Pagination.Next onClick={onNextClick} />
                <Pagination.Last onClick={onEndClick} />
            </Pagination>
        </Fragment>
    );
}

export default UsersList;
