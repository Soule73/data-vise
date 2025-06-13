// // Interfaces extraites des composants de présentation (UI)

// import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from "react";


// export type WidgetType = 'bar' | 'pie' | 'table' | 'line';

// export interface WidgetDefinition {
//     type: WidgetType;
//     label: string;
//     component: React.ComponentType<any>;
//     configSchema: any;
// }

// export interface MetricConfig {
//     agg: string;
//     field: string;
//     label?: string;
// }

// export interface BucketConfig {
//     field: string;
//     type?: string;
// }
// // Table
// export interface TableColumn<T> {
//     key: string;
//     label: string;
//     render?: (row: T) => React.ReactNode;
//     className?: string;
// }

// export interface TableProps<T> {
//     columns: TableColumn<T>[];
//     data: T[];
//     name?: string;
//     emptyMessage?: string;
//     paginable?: boolean;
//     searchable?: boolean;
//     rowPerPage?: number;
//     actionsColumn?: TableColumn<T>;
//     onClickItem?: (row: T) => void;
//     onSearch?: (value: string) => void;
//     onPageChange?: (page: number) => void;
//     page?: number;
//     totalRows?: number;
//     searchValue?: string;
// }

// // Sidebar
// export interface SidebarItemProps {
//     icon: React.ReactNode;
//     label: string;
//     to: string;
//     active?: boolean;
//     children?: React.ReactNode;
// }

// // SelectField
// export interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
//     options: Option[];
//     label?: string;
//     error?: string;
// }

// export interface Option {
//     value: string;
//     label: string;
// }

// // WidgetConfig
// export
//     interface WidgetConfigTabsProps {
//     tab: "data" | "metricsAxes" | "params";
//     setTab: (tab: "data" | "metricsAxes" | "params") => void;
// }


// export interface WidgetConfigFooterProps {
//     step: number;
//     loading: boolean;
//     onPrev: () => void;
//     onNext: () => void;
//     onSave: () => void;
//     isSaving: boolean;
// }

// // WidgetDataConfigSection
// export interface WidgetDataConfigSectionProps {
//     dataConfig: any;
//     config: any;
//     columns: string[];
//     handleConfigChange: (field: string, value: any) => void;
//     handleDragStart: (idx: number) => void;
//     handleDragOver: (idx: number, e: React.DragEvent) => void;
//     handleDrop: (idx: number) => void;
//     handleMetricAggOrFieldChange?: (
//         idx: number,
//         field: "agg" | "field",
//         value: any
//     ) => void;
// }

// // WidgetMetricStyleConfigSection
// export interface WidgetMetricStyleConfigSectionProps {
//     type: WidgetType;
//     metrics: any[];
//     metricStyles: any[];
//     handleMetricStyleChange: (
//         metricIdx: number,
//         field: string,
//         value: any
//     ) => void;
// }

// // WidgetParamsConfigSection
// export interface WidgetParamsConfigSectionProps {
//     type: WidgetType;
//     config: any;
//     handleConfigChange: (field: string, value: any) => void;
// }


// // WidgetStyleConfigSection
// export interface WidgetStyleConfigSectionProps {
//     type: WidgetType;
//     config: any;
//     columns: string[];
//     handleConfigChange: (field: string, value: any) => void;
// }

// // WidgetSelectModal
// export interface WidgetSelectModalProps {
//     open: boolean;
//     onClose: () => void;
//     onSelect: (widget: any) => void;
// }


// // WidgetSaveTitleModal
// export interface WidgetSaveTitleModalProps {
//     open: boolean;
//     onClose: () => void;
//     title: string;
//     setTitle: (t: string) => void;
//     error: string;
//     setError: (e: string) => void;
//     onConfirm: () => void;
//     loading: boolean;
// }

// // WidgetCreateSelectorModal
// export interface WidgetCreateSelectorResult {
//     type: WidgetType;
//     sourceId: string;
// }

// export interface TableSearchProps {
//     value: string;
//     onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
//     name?: string;
//     mountCountRef: React.MutableRefObject<number>;
// }

// // UserManagementPage
// export interface User {
//     _id: string;
//     email: string;
//     username: string;
//     roleId?: { _id: string; name: string };
// }

// export interface BreadcrumbItem {
//     url: string;
//     label: string;
// }

// export interface DashboardStore {
//     editMode: boolean;
//     setEditMode: (v: boolean) => void;
//     hasUnsavedChanges: boolean;
//     setHasUnsavedChanges: (v: boolean) => void;
//     layout: DashboardLayoutItem[]; // width/height natifs
//     setLayout: (l: DashboardLayoutItem[]) => void;
//     breadcrumb: BreadcrumbItem[];
//     setBreadcrumb: (items: BreadcrumbItem[]) => void;
//     dashboardTitle: string;
//     setDashboardTitle: (id: string, title: string) => void;
//     getDashboardDisplayTitle?: () => string;
// }


// export interface MetricLabelState {
//     metricLabels: string[];
//     setMetricLabel: (idx: number, label: string) => void;
//     setAllMetricLabels: (labels: string[]) => void;
// }

// export interface MetricUICollapseState {
//     collapsedMetrics: Record<string | number, boolean>;
//     toggleCollapse: (idx: string | number) => void;
//     setCollapsed: (collapsed: Record<string | number, boolean>) => void;
//     reset: () => void;
// }


// export type NotificationType = 'success' | 'error' | 'warning' | 'info' | 'default';

// export interface NotificationState {
//     open: boolean;
//     type: NotificationType;
//     title: string;
//     description?: string;
// }

// export interface NotificationStore {
//     notification: NotificationState;
//     showNotification: (notif: NotificationState) => void;
//     closeNotification: () => void;
// }

// export interface Role {
//     _id: string;
//     name: string;
//     description?: string;
//     permissions: string[];
//     canDelete?: boolean;
// }

// export interface RoleStore {
//     roles: Role[];
//     setRoles: (roles: Role[]) => void;
// }



// export interface Permission {
//     _id: string;
//     name: string;
//     description?: string;
// }

// export interface PermissionStore {
//     permissions: Permission[];
//     setPermissions: (perms: Permission[]) => void;
// }

// export interface UserRole {
//     id: string;
//     name: string;
//     description?: string;
//     permissions: { id: string; name: string; description?: string }[];
// }

// export interface UserState {
//     user: { id: string; username: string; email: string; role: UserRole | null } | null;
//     token: string | null;
//     setUser: (user: { id: string; username: string; email: string; role: UserRole | null }, token: string) => void;
//     logout: () => void;
// }

// export interface SidebarStore {
//     open: boolean;
//     isMobile: boolean;
//     setIsMobile: (mobile: boolean) => void;
//     openSidebar: () => void;
//     closeSidebar: () => void;
// }

// export interface SourcesStore {
//     sources: any[];
//     setSources: (s: any[]) => void;
// }

// export interface TableSearchState {
//     search: string;
//     setSearch: (search: string) => void;
//     reset: () => void;
// }

// export type ThemeMode = 'system' | 'light' | 'dark';

// export interface ThemeStore {
//     theme: ThemeMode;
//     setTheme: (theme: ThemeMode) => void;
// }


// export interface AlertModalProps {
//     open: boolean;
//     onClose: () => void;
//     onConfirm: () => void;
//     type?: 'error' | 'success' | 'info' | 'warning' | 'default';
//     title: string;
//     description?: string;
//     confirmLabel?: string;
//     cancelLabel?: string;
//     loading?: boolean;
// }

// export interface AuthLayoutProps {
//     title: string;
//     children: ReactNode;
//     logoUrl?: string;
//     bottomText?: ReactNode;
// }

// export interface BaseLayoutProps {
//     children: ReactNode;
// }


// export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
//     children: React.ReactNode;
//     size?: 'sm' | 'md' | 'lg';
//     color?: 'indigo' | 'red' | 'green' | 'gray';
//     variant?: 'solid' | 'outline';
//     loading?: boolean;
// }

// export interface CheckboxFieldProps {
//     label: string;
//     checked: boolean;
//     onChange: (checked: boolean) => void;
//     name?: string;
//     id?: string;
//     className?: string;
//     disabled?: boolean;
// }

// export interface ColorFieldProps {
//     label?: string;
//     value: string;
//     onChange: (value: string) => void;
//     name?: string;
//     id?: string;
//     disabled?: boolean;
// }

// export
//     interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
//     label: string;
//     error?: string;
// }


// export interface DashboardLayoutItem {
//     widgetId: string;
//     width: string;
//     height: number,
//     x: number;
//     y: number;
//     widget?: any;
// }

// export interface DashboardGridProps {
//     layout: DashboardLayoutItem[];
//     onSwapLayout?: (newLayout: DashboardLayoutItem[]) => void;
//     sources: any[];
//     editMode?: boolean;
//     hasUnsavedChanges?: boolean;
// }

// export interface ModalProps {
//     open: boolean;
//     onClose: () => void;
//     title?: React.ReactNode;
//     size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
//     children: React.ReactNode;
//     footer?: React.ReactNode;
//     hideCloseButton?: boolean;
//     className?: string;
// }

// export interface NotificationProps {
//     open: boolean;
//     onClose: () => void;
//     type?: NotificationType;
//     title: string;
//     description?: string;
//     duration?: number; // ms
//     position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
// }

// export interface PaginationProps {
//     effectivePage: number;
//     pageCount: number;
//     handlePageChange: (page: number) => void;
//     effectiveRowPerPage: number;
//     handleRowPerPageChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
//     total: number;
// }

// export interface Permission {
//     _id: string;
//     name: string;
//     description?: string;
// }

// export interface PermissionGroupCheckboxesProps {
//     permissions: Permission[];
//     checked: string[];
//     onToggle: (permId: string) => void;
// }

// export interface RoleCreateFormProps {
//     permissions: Permission[];
//     onSuccess: () => void;
// }

// export interface PermissionGroupProps {
//     model: string;
//     perms: any[];
//     checkedPerms: string[];
//     onToggle: (permId: string) => void;
//     editable: boolean;
// }

// export interface RoleActionsProps {
//     isEditing: boolean;
//     onEdit: () => void;
//     onCancel: () => void;
//     onSave: () => void;
//     onTogglePerms: () => void;
//     showPerms: boolean;
//     canDelete?: boolean;
//     onDelete?: () => void;
// }


// export interface RoleInfoProps {
//     isEditing: boolean;
//     name: string;
//     description: string;
//     onChangeName: (v: string) => void;
//     onChangeDescription: (v: string) => void;
// }