import { Button, TooltipLayout } from "@/components/ui";
import { ToastIcons } from "@/constants/ui";
import { DoctorTableFields, DoctorTableHeader, ToastTitles, ToastTypes } from "@/enums";
import { cn, showToast } from "@/lib";
import { doctorStore, globalStore } from "@/store";
import { DoctorTable } from "@/types";
import { CellContext, ColumnDef, HeaderContext } from "@tanstack/react-table";
import { ArchiveRestore, ArrowUpDown, CircleCheck, CircleX, Pencil, Trash2 } from "lucide-react";
import { useEffect } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";

export const columns: ColumnDef<DoctorTable>[] = [
	{
		accessorKey: DoctorTableFields.Index,
		header: (): React.ReactNode => <div className="text-center">{DoctorTableHeader.Index}</div>,
		cell: ({ row }: CellContext<DoctorTable, unknown>): React.ReactNode => {
			const index: number = parseInt(row.getValue(DoctorTableFields.Index));

			return <div className="text-center">{index}</div>;
		}
	},
	{
		id: DoctorTableFields.Id,
		accessorKey: DoctorTableFields.Id
	},
	{
		accessorKey: DoctorTableFields.Dni,
		header: (): React.ReactNode => <div className="text-center">{DoctorTableHeader.Dni}</div>,
		cell: ({ row }: CellContext<DoctorTable, unknown>): React.ReactNode => {
			const dni: string = row.getValue(DoctorTableFields.Dni);

			return <div className="text-center">{dni}</div>;
		}
	},
	{
		accessorKey: DoctorTableFields.FullName,
		header: ({ column }: HeaderContext<DoctorTable, unknown>): React.ReactNode => (
			<Button
				variant="ghost"
				className="w-full text-center font-semibold"
				onClick={(): void => {
					column.toggleSorting(column.getIsSorted() === "asc");
				}}
			>
				{DoctorTableHeader.FullName} <ArrowUpDown className="ml-2 h-4 w-4" />
			</Button>
		),
		cell: ({ row }: CellContext<DoctorTable, unknown>): React.ReactNode => {
			const fullName: string = row.getValue(DoctorTableFields.FullName);

			return <div className="text-center">{fullName}</div>;
		}
	},
	{
		accessorKey: DoctorTableFields.Phone,
		header: (): React.ReactNode => <div className="text-center">{DoctorTableHeader.Phone}</div>,
		cell: ({ row }: CellContext<DoctorTable, unknown>): React.ReactNode => {
			const phone: string = row.getValue(DoctorTableFields.Phone);

			return <div className="text-center">{phone}</div>;
		}
	},
	{
		accessorKey: DoctorTableFields.Email,
		header: (): React.ReactNode => <div className="text-center">{DoctorTableHeader.Email}</div>,
		cell: ({ row }: CellContext<DoctorTable, unknown>): React.ReactNode => {
			const email: string = row.getValue(DoctorTableFields.Email);

			return <div className="text-center">{email}</div>;
		}
	},
	{
		accessorKey: DoctorTableFields.Status,
		header: (): React.ReactNode => <div className="text-center">{DoctorTableHeader.Status}</div>,
		cell: ({ row }: CellContext<DoctorTable, unknown>): React.ReactNode => {
			const status: boolean = row.getValue(DoctorTableFields.Status);

			return status ? <CircleCheck className="mx-auto text-green-500" /> : <CircleX className="mx-auto text-red-500" />;
		}
	},
	{
		accessorKey: DoctorTableFields.UpdateDate,
		header: ({ column }: HeaderContext<DoctorTable, unknown>): React.ReactNode => (
			<Button
				variant="ghost"
				className="w-full text-center font-semibold"
				onClick={(): void => {
					column.toggleSorting(column.getIsSorted() === "asc");
				}}
			>
				{DoctorTableHeader.UpdateDate} <ArrowUpDown className="ml-2 h-4 w-4" />
			</Button>
		),
		cell: ({ row }: CellContext<DoctorTable, unknown>): React.ReactNode => {
			const updateDate: string = row.getValue(DoctorTableFields.UpdateDate);

			return <div className="text-center">{updateDate}</div>;
		}
	},
	{
		accessorKey: "actions",
		header: () => <div className="text-center">{DoctorTableHeader.Actions}</div>,
		cell: ({ row }: CellContext<DoctorTable, unknown>): React.ReactNode => {
			const { deleteDoctor, getDoctors } = doctorStore();
			const { errorMessage, clearErrorMessage, disableLoading, enableLoading, setErrorMessage } = globalStore();

			const navigate: NavigateFunction = useNavigate();

			const id: number = row.getValue(DoctorTableFields.Id);
			const status: boolean = row.getValue(DoctorTableFields.Status);

			const onDeleteDoctor = async (): Promise<void> => {
				enableLoading();

				const response: string = await deleteDoctor(id.toString());

				if (response !== "") {
					setErrorMessage(response);
					disableLoading();

					return;
				}

				getDoctors();

				disableLoading();
			};

			useEffect((): void => {
				if (errorMessage !== "") {
					showToast({
						type: ToastTypes.Error,
						title: ToastTitles.Error,
						message: errorMessage,
						icon: ToastIcons.Error,
						onDismissAndOnAutoCloseFunctions: clearErrorMessage
					});
				}
			}, [errorMessage]);

			return (
				<div className="flex items-center justify-center gap-2">
					<TooltipLayout
						triggerContent={
							<Button
								size="icon"
								className="bg-yellow-500 hover:bg-yellow-400"
								onClick={(): void => {
									navigate(`/admin/doctor/form/${id}`);
								}}
							>
								<Pencil className="h-4 w-4" />
							</Button>
						}
						content={<p>Editar</p>}
					/>

					<TooltipLayout
						triggerContent={
							<Button
								size="icon"
								className={cn({
									"bg-red-500 hover:bg-red-400": status,
									"bg-green-500 hover:bg-green-400": !status
								})}
								onClick={onDeleteDoctor}
							>
								{status ? <Trash2 className="h-4 w-4" /> : <ArchiveRestore className="h-4 w-4" />}
							</Button>
						}
						content={<p>{status ? "Eliminar" : "Restaurar"}</p>}
					/>
				</div>
			);
		}
	}
];
