import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
import { MdAdd, MdDeleteForever, MdOutlineEditNote } from "react-icons/md";
import { BiLoaderCircle } from 'react-icons/bi';
import Swal from 'sweetalert2';
import { useDebounce } from 'use-debounce';
import DataTable from "react-data-table-component";
import { toast } from 'sonner';

export default function Category({ auth }) {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalRows, setTotalRows] = useState(0);
    const [perPage, setPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [debounceSearch] = useDebounce(search, 500);
    const [sortField, setSortField] = useState("created_at");
    const [sortOrder, setSortOrder] = useState("desc");

    const [showModal, setShowModal] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState(null);

    const [name, setName] = useState('');

    const [loadingDelete, setLoadingDelete] = useState(null);

    const handleShowModal = () => {
        setShowModal(true);
        setTimeout(() => setIsVisible(true), 50);
    }

    const handleShowEditModal = (item) => {
        setIsEditing(true);
        setEditData(item);
        setName(item.name);
        handleShowModal();
    };

    const handleCloseModal = () => {
        setIsVisible(false);
        setTimeout(() => {
            setShowModal(false);
            setName('');
            setIsEditing(false);
            setEditData(null);
        }, 150); 
    };

    const handleSave = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('/category/create', {
                name: name,
            });

            if (response.status === 201) {
                fetchData();
                handleCloseModal(); 
                toast.success(response.data.message);
            } else {
                toast.error("There was an error" + response);
            }

        } catch (error) {
            toast.error("There was an error" + error);
        }
        
    };

    const handleEdit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`/category/update/${editData.id}`, {
                name: name,
            });

            if (response.status === 201) {
                fetchData();
                handleCloseModal();
                toast.success(response.data.message);

            }
            
        } catch (error) {
            toast.error("Error updating field data!" + error);
        }
    }

    const handleDelete = async (item) => {

        setLoadingDelete(item.id);

        const { isConfirmed } = await Swal.fire({
            title: 'Konfirmasi',
            text: "Apakah Anda yakin ingin menghapus data ini?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Ya, hapus data',
            cancelButtonText: 'Batal'
        });
    
        if (!isConfirmed) {
                setLoadingDelete(null);
                return;
            }

    
        try {
            const response = await axios.delete(`/category/delete/${item.id}`);
    
            if (response.status === 201) {
                fetchData();
                toast.success('Data berhasil dihapus.');
            }
        } catch (error) {
            toast.error("Gagal menghapus data!" + error);
        }
    }

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await axios.get("/category/data", {
                params: { 
                    search, 
                    perPage, 
                    page: currentPage, 
                    sort: sortField, 
                    order: sortOrder 
                },
            });

            setData(response.data.data);
            setTotalRows(response.data.total);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, [currentPage, perPage, debounceSearch, sortField, sortOrder]);

    const customStyles = {
        headCells: {
            style: {
                backgroundColor: "#F9FAFB",
            },
        },
    };

    const columns = [
        {
            name: (
                <div
                    scope="col"
                    className=" text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                    No
                </div>
            ),
            cell: (row, index) => (currentPage - 1) * perPage + index + 1,
            sortable: false,
        },
        { name: (
            <div
                scope="col"
                className=" text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
                Nama Kategori
            </div>
        ), selector: row => row.name, sortable: true },
        { 
            name: (
                <div
                    scope="col"
                    className=" text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                    Aksi
                </div>
            ), 
            cell: row =>
                <div className='flex gap-2'>
                    <div className='flex gap-1'>
                        <div className='p-2 w-fit rounded text-white bg-yellow-500 hover:bg-yellow-600 duration-150 hover:cursor-pointer' onClick={() => handleShowEditModal(row)}>
                            <MdOutlineEditNote className='text-2xl'/>
                        </div>
                    </div>
                    {
                        row.transactions_count == 0 ? (
                        <div className='flex gap-1'>
                            <div
                                className={`p-2 w-fit rounded text-white ${
                                    loadingDelete === row.id ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600 hover:cursor-pointer'
                                } duration-150`}
                                onClick={loadingDelete === row.id ? null : () => handleDelete(row)}
                                >
                                    <p>{loadingDelete === row.id ? (
                                        <BiLoaderCircle className='text-2xl'/>
                                    ) : (
                                        <MdDeleteForever className='text-2xl'/>
                                    )}</p>
                            </div>
                        </div>
                        ) : null
                    }
                </div>
        },
    ];


    return (
        <AuthenticatedLayout
            user={auth.user}
        >
            <Head title="Kategori" />
            <div className='bg-white rounded-lg border border-slate-300 p-4 text-sm'>
                <div className='flex justify-between items-center'>
                    <h1 className='font-bold text-lg my-4'>Daftar Kategori</h1>
                        <div className='bg-blue-500 rounded px-3 py-2 text-white hover:bg-blue-600 duration-150 hover:cursor-pointer' onClick={handleShowModal}>
                            <MdAdd className='inline'/> Tambah
                        </div>
                </div>
                <hr className='mt-2 mb-5'/>

                <div className="text-end">
                    <label htmlFor="">Search: </label>
                    <input
                        type="text"
                        placeholder="Search..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="mb-3 p-1.5 border rounded text-sm"
                    />

                    <hr />

                    {/* DataTable */}
                    <DataTable
                        columns={columns}
                        data={data}
                        customStyles={customStyles}
                        progressPending={loading}
                        progressComponent={<BiLoaderCircle className='m-6 text-xl'/>}
                        pagination
                        paginationServer
                        paginationTotalRows={totalRows}
                        onChangePage={setCurrentPage}
                        onChangeRowsPerPage={setPerPage}
                        onSort={(column, sortDirection) => {
                            const field = typeof column.selector === "function" ? column.selector({}) : column.selector;
                            setSortField(field);
                            setSortOrder(sortDirection);
                        }}
                    />
                </div>

            </div>
            {showModal && (
                <div className="fixed z-[999] inset-0 overflow-y-auto">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        {/* Overlay */}
                        <div className={`fixed inset-0 bg-gray-500 transition-opacity ease-in-out duration-100 ${isVisible ? 'opacity-75' : 'opacity-0'}`} aria-hidden="true"></div>

                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                        {/* Modal Content */}
                        <div className={`inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all ease-in-out duration-100 sm:my-8 sm:align-middle sm:max-w-lg sm:w-full 
                        ${isVisible ? 'opacity-100 translate-y-0 sm:scale-100' : 'opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'}`}>
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div>
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                                            {isEditing ? "Edit Data" : "Tambah Data Baru"}
                                        </h3>
                                        <hr  className='my-4'/>
                                        <div className="mt-2">
                                            <form onSubmit={isEditing ? handleEdit : handleSave}>
                                                <div className="mb-4">
                                                    <label className="block text-gray-700 text-sm font-bold mb-2">Kategori</label>
                                                    <input 
                                                        type="text" 
                                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-blue-500" 
                                                        placeholder="" 
                                                        value={name}
                                                        onChange={(e) => setName(e.target.value)}
                                                        required
                                                        autoFocus
                                                    />
                                                </div>
                                                <div className="sm:flex sm:flex-row-reverse">
                                                    <button
                                                        type="submit"
                                                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                                                    >
                                                        {isEditing ? 'Update' : 'Simpan'}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
                                                        onClick={handleCloseModal}
                                                    >
                                                        Batal
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                        </div>
                    </div>
                </div>
            )}

        </AuthenticatedLayout>
    );
}
