
import { createSlice, createAsyncThunk, } from "@reduxjs/toolkit";


const calculateComplexPricing = (units, project) => {
  let basePrice = 0;
  let floorPremium = 0;
  let balconyPremium = 0;
  let parkingFee = 0;
  let villaPremium = 0;
  units.forEach(unit => {
    let unitBasePrice = unit.price;
    let currentUnitPremium = 0
    if (unit.floor_level >= 1 && unit.floor_level <= 3) currentUnitPremium += unitBasePrice * 0.05;
    else if (unit.floor_level >= 4) currentUnitPremium += unitBasePrice * 0.12;
    floorPremium += currentUnitPremium;
    if (unit.has_balcony) balconyPremium += (unitBasePrice + currentUnitPremium) * 0.08;
    if (unit.has_parking) parkingFee += 15000;
    basePrice += unitBasePrice;

    if (project.total_units < 50) {
      if (unit.property_type === 'villa' && unit.has_parking && unit.has_balcony) {
        villaPremium += unitBasePrice * 0.02
      }
    }
  });
  // units.forEach(unit => {
  //   let unitBasePrice = unit.price;
  //   let currentUnitPremium = 0;
  //   if (unit.floor_level >= 1 && unit.floor_level <= 3) currentUnitPremium += unitBasePrice * 0.05;
  //   else if (unit.floor_level >= 4) currentUnitPremium += unitBasePrice * 0.12;
  //   floorPremium += currentUnitPremium;
  //   if (unit.has_balcony) balconyPremium += (unitBasePrice + currentUnitPremium) * 0.08;
  //   if (unit.has_parking) parkingFee += 15000;
  //   basePrice += unitBasePrice;
  // });


  let subtotal = basePrice + floorPremium + balconyPremium + parkingFee + villaPremium;
  const selectionPercentage = (units.length / project.total_units) * 100;

  const isBulkDiscountEligible = selectionPercentage > 30;
  let bulkDiscount = isBulkDiscountEligible ? subtotal * 0.03 : 0;
  let totalAfterDiscount = subtotal - bulkDiscount;
  let futureValueAppreciation = 0;
  if (project.completion_status === 'off_plan') {
    const monthsAway = (new Date(project.completion_date) - new Date()) / (1000 * 60 * 60 * 24 * 30.44);
    if (monthsAway > 18) futureValueAppreciation = totalAfterDiscount * 0.15;
  }
  const finalPrice = totalAfterDiscount;
  return {
    basePrice, floorPremium, balconyPremium, parkingFee, subtotal, bulkDiscount, isBulkDiscountEligible, futureValueAppreciation, finalPrice,
    breakdown: [
      { label: "Base Price of Selected Units", value: basePrice },
      { label: "Floor Level Premiums", value: floorPremium },
      { label: "Balcony Premiums (+8%)", value: balconyPremium },
      { label: "Parking Fees", value: parkingFee },
      { label: "villa premium (+2%)", value: villaPremium, inactive: villaPremium === 0 },
      { label: "Subtotal", value: subtotal, isBold: true },
      { label: `Bulk Discount (${selectionPercentage.toFixed(1)}% selected)`, value: -bulkDiscount, isDiscount: true, inactive: !isBulkDiscountEligible },
      { label: "Total Investment", value: finalPrice, isBold: true, isTotal: true },
      { label: "Est. Future Value (+15%)", value: finalPrice + futureValueAppreciation, inactive: futureValueAppreciation === 0, isFuture: true },
    ]
  };
};

const handleAvailabilityCascade = (updatedUnit, allUnits, project,) => {
  let sideEffects = [];
  const unitTypeKey = `${updatedUnit.property_type}-${updatedUnit.bedrooms}`;
  const similarUnits = allUnits.filter(u => `${u.property_type}-${u.bedrooms}` === unitTypeKey);
  const availableSimilarUnits = similarUnits.filter(u => u.status === 'available');
  if (availableSimilarUnits.length === 1 && availableSimilarUnits[0].unit_id === updatedUnit.unit_id) {
    const otherUnitsInZoneToMark = allUnits.filter(u => u.zone_id === project.zone_id && u.status === 'available' && u.bedrooms >= updatedUnit.bedrooms && u.unit_id !== updatedUnit.unit_id);
    if (otherUnitsInZoneToMark.length > 0) {
      sideEffects.push({ type: 'MARK_HIGH_DEMAND', payload: otherUnitsInZoneToMark.map(u => u.unit_id), notification: `Last ${unitTypeKey} unit reserved. Similar units are now in high demand!` });
    }
  }
  const totalAvailable = allUnits.filter(u => u.status === 'available').length - 1;
  const availabilityPercentage = (totalAvailable / project.total_units) * 100;
  if (availabilityPercentage < 20) {
    sideEffects.push({ type: 'TRIGGER_LIMITED_AVAILABILITY', notification: `Warning: Only ${totalAvailable} units left. Limited availability mode active.` });
  }
  return sideEffects;
};

const generatePersonalizationConfig = (selectedUnits, area) => {
  if (selectedUnits.length === 0) return { focusType: 'standard', showArabicContent: false };
  const showArabicContent = area?.area_name_ar?.includes("دبي") || false;
  let focusType = 'standard';
  const totalUnits = selectedUnits.length;
  const avgPricePerSqft = selectedUnits.reduce((sum, u) => sum + u.price, 0) / selectedUnits.reduce((sum, u) => sum + u.area_sqft, 0);
  if (avgPricePerSqft > 1200) focusType = 'luxury';
  else if ((selectedUnits.filter(u => u.bedrooms >= 2).length / totalUnits) > 0.5) focusType = 'family';
  else if ((selectedUnits.filter(u => u.bedrooms <= 1).length / totalUnits) > 0.6) focusType = 'investment';
  return { showArabicContent, focusType };
};

const runValidationChain = (selectedUnits, project) => {
  const errors = [];
  const totalSelectedUnits = selectedUnits.length;
  if (totalSelectedUnits === 0) return [];

  // Rule 1: Common Area Ratio (simulated)
  const totalSelectedArea = selectedUnits.reduce((sum, u) => sum + u.area_sqft, 0);
  const avgUnitSize = project.total_units > 0 ? (totalSelectedArea / totalSelectedUnits) : 0; // Avoid division by zero
  // const maxAllowedArea = (project.commonAreaRatio || 1.2) * avgUnitSize * totalSelectedUnits;


  const projectTotalEstimatedArea = project.total_units * avgUnitSize;
  if (totalSelectedArea > (projectTotalEstimatedArea * 0.05)) {
    // Let's say if total selected area > 5000, we trigger it.
    if (totalSelectedArea > 5000) {
      errors.push({
        id: 'area_ratio',
        severity: 'warning',
        message: 'High Common Area Ratio',
        description: 'The selected portfolio has a high total area, potentially impacting service charges. Please review.'
      });
    }
  }
  // Rule 2: Luxury Feature Limit
  const luxuryUnits = selectedUnits.filter(u => u.has_balcony && u.has_parking && u.bedrooms >= 4).length;
  const luxuryPercentage = (luxuryUnits / totalSelectedUnits) * 100;
  if (luxuryPercentage > 40) {
    errors.push({
      id: 'luxury_limit',
      severity: 'critical',
      message: 'Luxury Unit Limit Exceeded',
      description: `Your selection has ${luxuryPercentage.toFixed(0)}% luxury units, exceeding the 40% limit for balanced portfolios.`
    });
  }
  // Rule 3: Conflicting Phases
  const uniquePhases = [...new Set(selectedUnits.map(u => u.phase))];
  if (uniquePhases.length > 1) {
    errors.push({
      id: 'phase_conflict',
      severity: 'critical',
      message: 'Multiple Project Phases Selected',
      description: `You've selected units from different phases (${uniquePhases.join(', ')}), which may have different handover dates.`
    });
  }

  return errors;
}


// --- ASYNC THUNKS  ---

export const updatePricing = createAsyncThunk(
  "landingPage/updatePricing",
  async (_, { getState }) => {
    const { selectedUnits, selectedProject, allAreas } = getState().landingPage;
    if (selectedUnits.length === 0 || !selectedProject) {
      return {
        pricingResult: { basePrice: 0, finalPrice: 0, breakdown: [] },
        personalizationConfig: { focusType: 'standard', showArabicContent: false }
      };
    }
    const pricingResult = calculateComplexPricing(selectedUnits, selectedProject);
    const area = allAreas.find(a => a.area_id === selectedProject.area_id);
    const personalizationConfig = generatePersonalizationConfig(selectedUnits, area);
    return { pricingResult, personalizationConfig };
  }
);
export const updateUnitStatus = createAsyncThunk(
  "landingPage/updateUnitStatus",
  async ({ unitId, newStatus }, { getState, dispatch }) => {
    const { allUnits, selectedProject, allZones } = getState().landingPage;
    const unitToUpdate = allUnits.find(u => u.unit_id === unitId);
    if (!unitToUpdate || !selectedProject) {
      return { error: "Unit or project not found" };
    }
    let sideEffects = [];
    if (newStatus === 'reserved') {
      dispatch(startCountdown({ unitId, duration: 48 * 60 * 60 }));
      sideEffects = handleAvailabilityCascade(unitToUpdate, allUnits, selectedProject, allZones);
    }
    return { unitId, newStatus, sideEffects };
  }
);
export const validateSelection = createAsyncThunk(
  'landingPage/validateSelection',
  async (_, { getState }) => {
    const { selectedUnits, selectedProject } = getState().landingPage;
    if (!selectedProject || selectedUnits.length === 0) return [];
    return runValidationChain(selectedUnits, selectedProject);
  }
);
export const reconcileExternalChanges = createAsyncThunk(
  'landingPage/reconcileExternalChanges',
  async ({ newMasterUnitList, previousMasterUnitList }, { getState }) => {
    const { selectedUnits } = getState().landingPage;
    const conflicts = [];

    if (selectedUnits.length === 0 || !previousMasterUnitList || previousMasterUnitList.length === 0) {
      return { conflicts: [], masterListToSet: newMasterUnitList };
    }

    selectedUnits.forEach(selectedUnit => {
      const newUnitData = newMasterUnitList.find(u => u.unit_id === selectedUnit.unit_id);
      const oldUnitData = previousMasterUnitList.find(u => u.unit_id === selectedUnit.unit_id);

      if (!newUnitData || !oldUnitData) return;

      if (newUnitData.price !== oldUnitData.price) {
        conflicts.push({
          unitId: selectedUnit.unit_id,
          changeType: 'price',
          newData: { price: newUnitData.price },
          notification: {
            id: Date.now() + Math.random(),
            severity: 'warning',
            message: `Price changed for unit ${selectedUnit.unit_number}`,
            description: `Old: AED ${oldUnitData.price.toLocaleString()}, New: AED ${newUnitData.price.toLocaleString()}`,
            timestamp: new Date().toISOString(),
          }
        });
      }

      if (newUnitData.status !== oldUnitData.status && newUnitData.status === 'sold') {
        conflicts.push({
          unitId: selectedUnit.unit_id,
          changeType: 'status',
          newData: { status: 'sold' },
          notification: {}
        });
      }
    });

    return { conflicts, masterListToSet: newMasterUnitList };
  }
);



// --- SLICE DEFINITION ---

const initialState = {
  allProjects: [],
  allUnits: [],
  allAreas: [],
  allZones: [],

  // User Selection State
  selectedProject: null,
  selectedUnits: [],

  // Derived/Calculated State
  pricingCalculations: { finalPrice: 0, breakdown: [] },
  bulkDiscountEligible: false,

  contentPersonalization: {
    focusType: 'standard', // 'standard', 'investment', 'family', 'luxury'
    showArabicContent: false,
  },

  availabilityStatus: {
    mode: 'standard', // 'standard' or 'limited_availability'
  },

  countdownTimers: {}, // { [unitId]: secondsRemaining }

  validationErrors: [],
  notifications: [],
  layoutMode: 'standard',
};

export const landingPageSlice = createSlice({
  name: "landingPage",
  initialState,
  reducers: {
    setMasterData: (state, action) => {
      state.allProjects = action.payload.projects;
      state.allUnits = action.payload.units;
      state.allZones = action.payload.zones;
      state.allAreas = action.payload.areas;
    },

    setSelectedUnits: (state, action) => {
      state.selectedUnits = action.payload;
    },
    startCountdown: (state, action) => {
      const { unitId, duration } = action.payload;
      state.countdownTimers[unitId] = duration;
      // FIX: When a timer starts, immediately switch to focus mode
      state.layoutMode = 'focus';
    },
    tick: (state) => {
      Object.keys(state.countdownTimers).forEach(unitId => {
        if (state.countdownTimers[unitId] > 0) {
          state.countdownTimers[unitId] -= 1;
        } else {
          delete state.countdownTimers[unitId];
        }
      }); if (Object.keys(state.countdownTimers).length === 0) {
        state.layoutMode = 'standard';
      }
    },
    setProject: (state, action) => {
      state.selectedProject = action.payload;
      state.selectedUnits = [];
      state.pricingCalculations = { finalPrice: 0, breakdown: [] };
      state.contentPersonalization = { focusType: 'standard', showArabicContent: false };
      state.layoutMode = 'standard';
      state.validationErrors = [];
      state.notifications = [];
    },
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload);
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    clearAllNotifications: (state) => {
      state.notifications = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(updatePricing.fulfilled, (state, action) => {
        state.pricingCalculations = action.payload.pricingResult;
        state.bulkDiscountEligible = action.payload.pricingResult.isBulkDiscountEligible;
        state.contentPersonalization = action.payload.personalizationConfig;
      })
      .addCase(updateUnitStatus.fulfilled, (state, action) => {
        if (action.payload.error) return;
        const { unitId, newStatus, sideEffects } = action.payload;
        const unitIndex = state.allUnits.findIndex(u => u.unit_id === unitId);
        if (unitIndex !== -1) {
          state.allUnits[unitIndex].status = newStatus;
        }
        sideEffects.forEach(effect => {
          if (effect.type === 'MARK_HIGH_DEMAND') {
            effect.payload.forEach(idToMark => {
              const idx = state.allUnits.findIndex(u => u.unit_id === idToMark);
              if (idx !== -1) state.allUnits[idx].demand_status = 'high_demand';
            });
          }
          if (effect.type === 'TRIGGER_LIMITED_AVAILABILITY') {
            state.availabilityStatus.mode = 'limited_availability';
          }
        });
      })
      .addCase(validateSelection.fulfilled, (state, action) => {
        state.validationErrors = action.payload;
      })

      .addCase(reconcileExternalChanges.fulfilled, (state, action) => {
        const { conflicts, masterListToSet } = action.payload;

        state.allUnits = masterListToSet;

        conflicts.forEach(conflict => {
          const selectedUnitIndex = state.selectedUnits.findIndex(u => u.unit_id === conflict.unitId);
          if (selectedUnitIndex !== -1) {
            if (conflict.changeType === 'price') state.selectedUnits[selectedUnitIndex].price = conflict.newData.price;
            if (conflict.changeType === 'status') state.selectedUnits[selectedUnitIndex].status = conflict.newData.status;
          }
          state.notifications.unshift(conflict.notification);
        });
      });

  }
});

export const {
  setProject, setSelectedUnits, setMasterData, startCountdown, tick,
  addNotification, removeNotification, clearAllNotifications
} = landingPageSlice.actions;
export default landingPageSlice.reducer;