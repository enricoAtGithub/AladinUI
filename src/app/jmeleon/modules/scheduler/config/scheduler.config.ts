export const eventSchedulerSettings = {
    initialView: 'TimelineWorkWeek'
};

export const resourceSchedulerSettings = {
    initialView: 'TimelineDay',
    filterText: {
        assigned: 'eingeteilt',
        available: 'verfügbar',
        hasConflict: 'indisponibel'
    },
    icons: {
        assign: 'pi pi-user-plus',
        unassign: 'pi pi-user-minus',
        hasConflict: 'pi pi-exclamation-triangle'
    },
    iconText: {
        assign: 'einteilen',
        unassign: 'Zuordnung lösen',
        hasConflict: 'Konflikt'
    }
};

export const availabiltySchedulerSettings = {
    initialView: 'TimelineMonth',
};
