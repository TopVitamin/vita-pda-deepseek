// ==================== 基础类型 ====================
export interface User {
  userId: string;
  username: string;
  name: string;
  phone: string;
  role: string;
  warehouseIds: string[];
  permissions: string[];
}

export interface Warehouse {
  warehouseId: string;
  code: string;
  name: string;
  type: string;
  orgName: string;
  address: string;
  status: 'active' | 'inactive';
  todayTaskCount: number;
}

// ==================== 商品 ====================
export interface Product {
  productId: string;
  code: string;
  name: string;
  barcode: string;
  spec: string;
  unit: string;
  batchNo?: string;
  locationCode?: string;
  totalQty: number;
  availableQty: number;
  frozenQty: number;
  lockedQty: number;
}

// ==================== 库存 ====================
export interface InventoryRecord {
  id: string;
  productId: string;
  productCode: string;
  productName: string;
  barcode: string;
  warehouseCode: string;
  locationCode: string;
  batchNo: string;
  totalQty: number;
  availableQty: number;
  frozenQty: number;
  lockedQty: number;
}

export interface InventoryFlow {
  id: string;
  time: string;
  opType: string;
  docNo: string;
  productCode: string;
  productName: string;
  locationCode: string;
  beforeQty: number;
  changeQty: number;
  afterQty: number;
  operator: string;
}

// ==================== 任务 ====================
export type TaskType =
  | 'receive' | 'qc' | 'putaway' | 'picking' | 'sorting'
  | 'recheck' | 'packing' | 'weighing' | 'ship'
  | 'move' | 'relocate' | 'replenish' | 'counting';

export type TaskStatus =
  | 'pending' | 'in_progress' | 'partial' | 'completed' | 'exception' | 'cancelled';

export interface TaskItem {
  taskId: string;
  taskNo: string;
  type: TaskType;
  typeName: string;
  docNo: string;
  status: TaskStatus;
  statusName: string;
  planQty: number;
  doneQty: number;
  deadline?: string;
  priority: 'high' | 'normal' | 'low';
  assignee?: string;
}

// ==================== 入库 ====================
export interface InboundDoc {
  docNo: string;
  type: string;
  typeName: string;
  sourceNo: string;
  supplier: string;
  expectedDate: string;
  status: string;
  items: InboundDocItem[];
}

export interface InboundDocItem {
  id: string;
  productCode: string;
  productName: string;
  barcode: string;
  spec: string;
  unit: string;
  planQty: number;
  receivedQty: number;
  waitQty: number;
  currentQty: number;
}

export interface QcTask {
  taskNo: string;
  inboundNo: string;
  productCount: number;
  waitQcQty: number;
  doneQcQty: number;
  items: QcItem[];
}

export interface QcItem {
  id: string;
  productCode: string;
  productName: string;
  barcode: string;
  qcQty: number;
  result?: string;
  exceptionReason?: string;
}

export interface PutawayTask {
  taskNo: string;
  inboundNo: string;
  status: string;
  waitQty: number;
  doneQty: number;
  items: PutawayItem[];
}

export interface PutawayItem {
  id: string;
  productCode: string;
  productName: string;
  barcode: string;
  batchNo: string;
  planQty: number;
  doneQty: number;
  waitQty: number;
  targetLocation?: string;
}

// ==================== 出库 ====================
export interface PickingTask {
  taskNo: string;
  outboundNo: string;
  waveNo: string;
  status: string;
  progress: string;
  items: PickingItem[];
}

export interface PickingItem {
  id: string;
  locationCode: string;
  productCode: string;
  productName: string;
  barcode: string;
  planQty: number;
  pickedQty: number;
  waitQty: number;
  status: string;
}

export interface SortingTask {
  taskNo: string;
  waveNo: string;
  items: SortingItem[];
}

export interface SortingItem {
  id: string;
  store: string;
  orderNo: string;
  slotNo: string;
  productCode: string;
  productName: string;
  barcode: string;
  planQty: number;
  sortedQty: number;
}

export interface RecheckTask {
  taskNo: string;
  orderNo: string;
  boxNo?: string;
  planQty: number;
  doneQty: number;
  items: RecheckItem[];
}

export interface RecheckItem {
  id: string;
  productCode: string;
  productName: string;
  barcode: string;
  planQty: number;
  checkedQty: number;
  diffType?: string;
}

export interface PackingBox {
  boxNo: string;
  orderNo: string;
  status: 'open' | 'closed';
  items: PackingItem[];
  totalQty: number;
}

export interface PackingItem {
  id: string;
  productCode: string;
  productName: string;
  barcode: string;
  packedQty: number;
}

export interface ShipTask {
  taskNo: string;
  carrier: string;
  logisticsNo: string;
  plateNo?: string;
  driver?: string;
  shipTime?: string;
  boxes: ShipBox[];
  totalBoxes: number;
  scannedBoxes: number;
}

export interface ShipBox {
  boxNo: string;
  scanned: boolean;
  orderNo: string;
  weight?: number;
}

// ==================== 库内作业 ====================
export interface MoveRequest {
  productCode: string;
  productName: string;
  barcode: string;
  fromLocation: string;
  toLocation: string;
  qty: number;
  reason: string;
}

// ==================== 盘点 ====================
export type CountingType = 'full' | 'location' | 'product' | 'dynamic' | 'spot' | 'cycle';

export interface CountingTask {
  taskNo: string;
  type: CountingType;
  typeName: string;
  range: string;
  status: TaskStatus;
  countedQty: number;
  totalQty: number;
  blindMode: boolean;
  items: CountingItem[];
}

export interface CountingItem {
  id: string;
  locationCode: string;
  productCode: string;
  productName: string;
  barcode: string;
  bookQty: number;
  actualQty?: number;
  diffQty?: number;
}

// ==================== 容器 ====================
export type ContainerType = 'box' | 'tote' | 'pallet' | 'cage' | 'slot';

export interface Container {
  code: string;
  type: ContainerType;
  typeName: string;
  status: string;
  bindTarget?: string;
  locationCode?: string;
  items?: Product[];
}

// ==================== 异常 ====================
export type ExceptionType =
  | 'inbound_diff' | 'damaged' | 'wrong_goods' | 'near_expiry'
  | 'picking_short' | 'recheck_diff' | 'box_error'
  | 'location_error' | 'stock_short' | 'system_data_error';

export interface ExceptionRecord {
  id: string;
  exceptionNo: string;
  type: ExceptionType;
  typeName: string;
  docNo: string;
  productCode: string;
  productName: string;
  locationCode?: string;
  qty: number;
  reason: string;
  status: 'pending' | 'processing' | 'resolved';
  remark?: string;
  createTime: string;
}

// ==================== 作业记录 ====================
export interface OperationRecord {
  id: string;
  time: string;
  opType: string;
  docNo: string;
  productName?: string;
  qty?: number;
  locationCode?: string;
  operator: string;
  result: string;
}

export interface ScanRecord {
  id: string;
  time: string;
  content: string;
  type: string;
  result: string;
}

// ==================== 系统 ====================
export interface SystemParams {
  autoSubmitAfterScan: boolean;
  soundEnabled: boolean;
  vibrateEnabled: boolean;
  defaultQtyOne: boolean;
  autoFocusNext: boolean;
  showSensitiveStock: boolean;
  pageSize: number;
}

// ==================== API 通用返回 ====================
export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}
