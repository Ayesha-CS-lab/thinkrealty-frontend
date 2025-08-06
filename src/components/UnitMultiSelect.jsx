import { useState, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Card,
  Button,
  Input,
  Select,
  Row,
  Col,
  Empty,
  Typography,
  Tag,
  Divider,
  Checkbox,
  Pagination,
} from "antd";
import { updateUnitStatus } from "../features/landingPage/landingPageSlice";
import { useScreenSize } from "../hooks/useScreenSize";

import {
  Search,
  Filter,
  FileText,
  Building2 as FloorIcon,
  Bed,
  Square as AreaIcon,
  Car,
  BuildingIcon as BalconyIcon,
  AlertTriangle,
} from "lucide-react";

const { Option } = Select;
const { Text, Title } = Typography;
const PAGE_SIZE = 12;

export default function UnitMultiSelect({ onUnitsChange, selectedUnits }) {
  const dispatch = useDispatch();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterBedrooms, setfilterBedrooms] = useState("all");
  const [sortBy, setSortBy] = useState("price_asc");
  const [currentPage, setCurrentPage] = useState(1);

  const masterUnitList = useSelector((state) => state.landingPage.allUnits);
  const selectedProject = useSelector(
    (state) => state.landingPage.selectedProject
  );

  const { width } = useScreenSize();
  const isMobile = width < 768;

  const selectedIds = useMemo(
    () => selectedUnits.map((u) => u.unit_id),
    [selectedUnits]
  );

  useEffect(() => {
    if (selectedProject) {
      setSearchTerm("");
      setfilterBedrooms("all");
      setSortBy("price_asc");
      setCurrentPage(1);
    }
  }, [selectedProject]);

  const handleReserveClick = (e, unit) => {
    e.stopPropagation();
    dispatch(updateUnitStatus({ unitId: unit.unit_id, newStatus: "reserved" }));
  };

  const toggleSelect = (unit) => {
    if (!masterUnitList) return; // Defensive check
    const masterUnit = masterUnitList.find((u) => u.unit_id === unit.unit_id);
    if (!masterUnit || masterUnit.status !== "available") return;

    const isSelected = selectedIds.includes(unit.unit_id);
    const newSelectedUnits = isSelected
      ? selectedUnits.filter((u) => u.unit_id !== unit.unit_id)
      : [...selectedUnits, masterUnit];
    onUnitsChange(newSelectedUnits);
  };

  const filteredAndSortedUnits = useMemo(() => {
    if (!selectedProject || !masterUnitList || masterUnitList.length === 0)
      return [];

    const filtered = masterUnitList.filter((unit) => {
      if (unit.project_id !== selectedProject.project_id) return false;
      const matchesSearch = unit.unit_number
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesBedromes =
        filterBedrooms === "all" || unit.bedrooms.toString() === filterBedrooms;
      return matchesSearch && matchesBedromes;
    });

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "price_desc":
          return b.price - a.price;
        case "area_desc":
          return b.area_sqft - a.area_sqft;
        case "price_asc":
        default:
          return a.price - b.price;
      }
    });
  }, [masterUnitList, selectedProject, searchTerm, filterBedrooms, sortBy]);

  const paginatedUnits = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return filteredAndSortedUnits.slice(startIndex, startIndex + PAGE_SIZE);
  }, [currentPage, filteredAndSortedUnits]);

  const getStatusTag = (status) => {
    switch (status) {
      case "reserved":
        return <Tag color="warning">Reserved</Tag>;
      case "sold":
        return <Tag color="error">Sold</Tag>;
      default:
        return <Tag color="success">Available</Tag>;
    }
  };

  return (
    <Card title={<Title level={4}>Step 2: Select Your Units</Title>}>
      {/* FILTERS */}
      <Row gutter={[16, 16]} align="bottom">
        <Col xs={24} md={12} lg={8}>
          <Text className="font-medium block mb-1">Search by Unit No.</Text>
          <Input
            placeholder="e.g., A101"
            prefix={<Search size={16} />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Col>
        <Col xs={12} md={6} lg={5}>
          <Text className="font-medium block mb-1">Bedrooms</Text>
          <Select
            className="w-full"
            value={filterBedrooms}
            onChange={setfilterBedrooms}
          >
            <Option value="all">All</Option>
            <Option value="0">Studio</Option>
            <Option value="1">1 BR</Option>
            <Option value="2">2 BR</Option>
            <Option value="3">3+ BR</Option>
          </Select>
        </Col>
        <Col xs={12} md={6} lg={5}>
          <Text className="font-medium block mb-1">Sort By</Text>
          <Select className="w-full" value={sortBy} onChange={setSortBy}>
            <Option value="price_asc">Price (Low-High)</Option>
            <Option value="price_desc">Price (High-Low)</Option>
            <Option value="area_desc">Area (High-Low)</Option>
          </Select>
        </Col>
        <Col>
          <Button
            icon={<Filter size={16} />}
            onClick={() => {
              setSearchTerm("");
              setfilterBedrooms("all");
              setSortBy("price_asc");
            }}
          >
            Clear
          </Button>
        </Col>
      </Row>

      <Divider />

      {/* UNIT CARDS GRID & PAGINATION */}
      <div className="bg-gray-50/50 p-4 rounded-lg">
        {paginatedUnits.length > 0 ? (
          <>
            <Row gutter={[isMobile ? 12 : 16, isMobile ? 12 : 16]}>
              {paginatedUnits.map((unit) => {
                const isSelected = selectedIds.includes(unit.unit_id);
                const isUnavailable = unit.status !== "available";
                const selectedVersion = selectedUnits.find(
                  (su) => su.unit_id === unit.unit_id
                );
                const hasPriceChanged =
                  selectedVersion && selectedVersion.price !== unit.price;

                return (
                  <Col xs={24} sm={12} lg={8} key={unit.unit_id}>
                    {isMobile ? (
                      // --- COMPACT MOBILE VIEW ---
                      <div
                        className={`bg-white rounded-lg border-2 p-3 flex justify-between items-center transition-all ${
                          isUnavailable ? "opacity-60" : "cursor-pointer"
                        } ${
                          isSelected ? "border-blue-500" : "border-gray-200"
                        }`}
                        onClick={() => toggleSelect(unit)}
                      >
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <FileText size={16} />
                            <Text strong>{unit.unit_number}</Text>
                          </div>
                          {getStatusTag(unit.status)}
                          <Title
                            level={5}
                            className={`!mt-2 !mb-0 ${
                              hasPriceChanged
                                ? "!text-orange-500"
                                : "!text-blue-600"
                            }`}
                          >
                            AED {unit.price.toLocaleString()}
                          </Title>
                        </div>
                        <Checkbox
                          checked={isSelected}
                          disabled={isUnavailable}
                        />
                      </div>
                    ) : (
                      // --- FULL DESKTOP VIEW ---
                      <div
                        className={`bg-white rounded-lg border-2 flex flex-col transition-all h-full ${
                          isUnavailable
                            ? "opacity-60 cursor-not-allowed"
                            : "cursor-pointer hover:shadow-md"
                        } ${
                          isSelected
                            ? "border-blue-500 shadow-lg"
                            : "border-gray-200"
                        }`}
                        onClick={() => toggleSelect(unit)}
                      >
                        <div className="p-4 flex-grow">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <FileText size={18} />
                              <Text strong className="text-lg">
                                {unit.unit_number}
                              </Text>
                            </div>
                            <Checkbox
                              checked={isSelected}
                              disabled={isUnavailable}
                            />
                          </div>
                          <div className="mt-3">
                            {getStatusTag(unit.status)}
                          </div>
                          <div className="space-y-2 text-base text-gray-700 mt-3">
                            <div className="flex items-center gap-3">
                              <Bed size={18} />{" "}
                              {unit.bedrooms === 0
                                ? "Studio"
                                : `${unit.bedrooms} BR`}
                            </div>
                            <div className="flex items-center gap-3">
                              <AreaIcon size={18} />{" "}
                              {unit.area_sqft.toLocaleString()} sqft
                            </div>
                            <div className="flex items-center gap-3">
                              <FloorIcon size={18} /> Floor {unit.floor_level}
                            </div>
                          </div>
                          {(unit.has_balcony || unit.has_parking) && (
                            <div className="flex items-center gap-4 text-sm pt-3 mt-2 border-t border-gray-100">
                              {unit.has_balcony && (
                                <div className="flex items-center gap-1.5 text-green-700">
                                  <BalconyIcon size={16} /> Balcony
                                </div>
                              )}
                              {unit.has_parking && (
                                <div className="flex items-center gap-1.5 text-blue-700">
                                  <Car size={16} /> Parking
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="p-4 border-t border-gray-100 bg-gray-50/50">
                          {hasPriceChanged && (
                            <div className="flex items-center gap-1 text-orange-500 text-xs font-semibold mb-1">
                              <AlertTriangle size={14} /> Price Updated!
                            </div>
                          )}
                          <Title
                            level={5}
                            className={`!mb-0 ${
                              hasPriceChanged
                                ? "!text-orange-500"
                                : "!text-blue-600"
                            }`}
                          >
                            AED {unit.price.toLocaleString()}
                          </Title>
                          <Text type="secondary" className="text-xs">
                            AED{" "}
                            {Math.round(
                              unit.price / unit.area_sqft
                            ).toLocaleString()}
                            /sqft
                          </Text>
                          {unit.phase && (
                            <Text
                              type="secondary"
                              className="text-xs block mt-1"
                            >
                              Phase: {unit.phase}
                            </Text>
                          )}
                          {!isUnavailable && (
                            <Button
                              type="primary"
                              size="small"
                              className="mt-2 w-full"
                              onClick={(e) => handleReserveClick(e, unit)}
                            >
                              Reserve
                            </Button>
                          )}
                        </div>
                      </div>
                    )}
                  </Col>
                );
              })}
            </Row>

            {filteredAndSortedUnits.length > PAGE_SIZE && (
              <div className="text-center mt-6">
                <Pagination
                  current={currentPage}
                  pageSize={PAGE_SIZE}
                  total={filteredAndSortedUnits.length}
                  onChange={(page) => setCurrentPage(page)}
                  showSizeChanger={false}
                />
              </div>
            )}
          </>
        ) : (
          <Empty description="No units match your criteria. Please adjust the filters." />
        )}
      </div>
    </Card>
  );
}
