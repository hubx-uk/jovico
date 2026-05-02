// components/admin/AdminTable.tsx
// On mobile (<md): renders as a list of cards.
// On md+: renders as a proper <table>.

interface Column<T> {
    key: string
    header: string
    className?: string
    render: (row: T) => React.ReactNode
    /** If true, this column is hidden on mobile card view */
    hideOnMobile?: boolean
}

interface Props<T> {
    rows: T[]
    columns: Column<T>[]
    keyFn: (row: T) => string
    empty?: React.ReactNode
}

export function AdminTable<T>({ rows, columns, keyFn, empty }: Props<T>) {
    if (rows.length === 0) {
        return (
            <div className='py-20 text-center text-slate-400'>
                {empty ?? <p className='text-sm'>No data found</p>}
            </div>
        )
    }

    const visibleCols = columns.filter((c) => !c.hideOnMobile)

    return (
        <>
            {/* Mobile: card list */}
            <div className='md:hidden divide-y divide-slate-50'>
                {rows.map((row) => (
                    <div
                        key={keyFn(row)}
                        className='p-4 space-y-2 hover:bg-slate-50 transition-colors'
                    >
                        {visibleCols.map((col) => (
                            <div key={col.key} className='flex items-start justify-between gap-3'>
                                <span className='text-xs font-semibold text-slate-400 uppercase tracking-wider shrink-0 w-24'>
                                    {col.header}
                                </span>
                                <div className='text-sm text-slate-900 text-right min-w-0'>
                                    {col.render(row)}
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            {/* Desktop: proper table */}
            <div className='hidden md:block overflow-x-auto'>
                <table className='w-full text-sm'>
                    <thead>
                        <tr className='border-b border-slate-100 bg-slate-50'>
                            {columns.map((col) => (
                                <th
                                    key={col.key}
                                    className={`text-left px-4 lg:px-6 py-3.5 font-semibold text-slate-600 whitespace-nowrap ${col.className ?? ''}`}
                                >
                                    {col.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className='divide-y divide-slate-50'>
                        {rows.map((row) => (
                            <tr key={keyFn(row)} className='hover:bg-slate-50 transition-colors'>
                                {columns.map((col) => (
                                    <td
                                        key={col.key}
                                        className={`px-4 lg:px-6 py-4 ${col.className ?? ''}`}
                                    >
                                        {col.render(row)}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}
