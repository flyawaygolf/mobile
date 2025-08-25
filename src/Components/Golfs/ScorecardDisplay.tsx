import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, DataTable } from 'react-native-paper';

import { scorecardGridInterface, scoreCardInterface, scorecardTeeboxInterface } from '../../Services/Client/Managers/Interfaces/Golf';
import { useTheme } from '../Container';

interface ScorecardDisplayProps {
    scorecards: scoreCardInterface[];
}

const ScorecardDisplay: React.FC<ScorecardDisplayProps> = ({ scorecards }) => {
    const { t } = useTranslation();
    const { colors } = useTheme();
    const [isMetric, setIsMetric] = useState(true);

    const TeeboxColors: { [key: string]: string } = {
        "white": colors.color_white,
        "red": colors.badge_color,
        "blue": colors.color_blue,
        "yellow": colors.color_yellow,
        "black": colors.color_black,
        "brass": colors.color_brass,
        "bronze": colors.color_bronze,
        "brown": colors.color_brown,
        "burgundy": colors.color_burgundy,
        "copper": colors.color_copper,
        "gold": colors.color_gold,
        "grey": colors.color_grey,
        "green": colors.color_green,
        "jade": colors.color_jade,
        "magenta": colors.color_magenta,
        "orange": colors.color_orange,
        "peach": colors.color_peach,
        "platinum": colors.color_platinum,
        "purple": colors.color_purple,
        "silver": colors.color_silver,
        "teal": colors.color_teal,
        "turquoise": colors.color_turquoise,
    }

    const calculateTotal = (values: number[]) => {
        return values.reduce((sum, value) => sum + value, 0);
    };

    const convertDistance = (yards: number) => {
        return isMetric ? Math.round(yards * 0.9144) : yards;
    };

    const renderColorDot = (colorHex: string, colorName: string) => (
        <View style={[styles.colorDot, { backgroundColor: TeeboxColors[colorName] ?? colorHex }]} />
    );

    const getGenderLabel = (grid: scorecardGridInterface) => {
        const hasYellowOrWhite = grid.teeboxes.some(teebox =>
            teebox.name.toLowerCase() === 'yellow' ||
            teebox.name.toLowerCase() === 'white' ||
            teebox.color.name.toLowerCase() === 'yellow' ||
            teebox.color.name.toLowerCase() === 'white'
        );
        return hasYellowOrWhite ? t('golf.men') : t('golf.women');
    };

    const renderScorecardTable = (scorecard: scoreCardInterface) => {
        const maxHoles = Math.max(...scorecard.grid.map(grid => grid.par.length));

        return (
            <View key={scorecard.scorecard_id} style={styles.gridContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <DataTable style={styles.dataTable}>
                        {scorecard.grid.map((grid, gridIndex) => (
                            <React.Fragment key={grid.grid_id}>
                                {/* Séparateur de parcours */}
                                {
                                    <Text style={[styles.headerText]}>
                                        {getGenderLabel(grid)}
                                    </Text>
                                }

                                {/* Ligne des Pars */}
                                <DataTable.Header>
                                    <DataTable.Title style={styles.firstColumn}>
                                        <Text style={styles.headerText}>{t('golf.holes')}</Text>
                                    </DataTable.Title>
                                    {Array.from({ length: maxHoles }, (_, index) => (
                                        <DataTable.Title key={index} style={styles.holeColumn} numeric>
                                            <Text style={styles.holeNumber}>{index + 1}</Text>
                                        </DataTable.Title>
                                    ))}
                                    <DataTable.Title style={styles.totalColumn} numeric>
                                        <Text style={styles.headerText}>{t('commons.total')}</Text>
                                    </DataTable.Title>
                                </DataTable.Header>
                                <DataTable.Row>
                                    <DataTable.Cell style={styles.firstColumn}>
                                        <Text style={styles.rowLabel}>
                                            {t('golf.par')}
                                        </Text>
                                    </DataTable.Cell>
                                    {Array.from({ length: maxHoles }, (_, index) => (
                                        <DataTable.Cell key={index} style={styles.holeColumn} numeric>
                                            <Text style={styles.cellValue}>
                                                {grid.par[index] || '-'}
                                            </Text>
                                        </DataTable.Cell>
                                    ))}
                                    <DataTable.Cell style={styles.totalColumn} numeric>
                                        <Text style={styles.totalValue}>{calculateTotal(grid.par)}</Text>
                                    </DataTable.Cell>
                                </DataTable.Row>

                                {/* Ligne des Handicaps */}
                                <DataTable.Row>
                                    <DataTable.Cell style={styles.firstColumn}>
                                        <Text style={styles.rowLabel}>
                                            {t('golf.handicap')}
                                        </Text>
                                    </DataTable.Cell>
                                    {Array.from({ length: maxHoles }, (_, index) => (
                                        <DataTable.Cell key={index} style={styles.holeColumn} numeric>
                                            <Text style={styles.cellValue}>
                                                {grid.handicap[index] || '-'}
                                            </Text>
                                        </DataTable.Cell>
                                    ))}
                                    <DataTable.Cell style={styles.totalColumn} numeric>
                                        <Text style={styles.totalValue}>-</Text>
                                    </DataTable.Cell>
                                </DataTable.Row>

                                {/* Lignes des distances pour chaque teebox */}
                                {grid.teeboxes.map((teebox: scorecardTeeboxInterface, teeboxIndex) => (
                                    <DataTable.Row key={`${gridIndex}-${teeboxIndex}`}>
                                        <DataTable.Cell style={styles.firstColumn}>
                                            <View style={styles.teeboxLabel}>
                                                {renderColorDot(teebox.color.hex, teebox.name.toLocaleLowerCase())}
                                                <View>
                                                    <Text style={[styles.rowLabel]}>
                                                        {t(`colors.${teebox.name.toLocaleLowerCase()}`)}
                                                    </Text>
                                                    <Text variant='bodySmall' style={[styles.rowLabel]}>
                                                        {teebox.rating}/{teebox.slope}
                                                    </Text>
                                                </View>
                                            </View>
                                        </DataTable.Cell>
                                        {Array.from({ length: maxHoles }, (_, index) => (
                                            <DataTable.Cell key={index} style={styles.holeColumn} numeric>
                                                <Text style={styles.cellValue}>
                                                    {teebox.distances[index] ? convertDistance(teebox.distances[index]) : '-'}
                                                </Text>
                                            </DataTable.Cell>
                                        ))}
                                        <DataTable.Cell style={styles.totalColumn} numeric>
                                            <Text style={styles.totalValue}>
                                                {convertDistance(calculateTotal(teebox.distances))}
                                            </Text>
                                        </DataTable.Cell>
                                    </DataTable.Row>
                                ))}
                            </React.Fragment>
                        ))}
                    </DataTable>
                </ScrollView>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.infoContainer}>
                <Text variant="titleLarge">
                    {t('golf.scorecard_display')}
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
                    <Text onPress={() => setIsMetric(!isMetric)} style={{ textDecorationLine: isMetric ? 'none' : 'underline' }}>
                        {t("commons.yards")}
                    </Text>
                    <Text>
                        |
                    </Text>
                    <Text onPress={() => setIsMetric(!isMetric)} style={{ textDecorationLine: isMetric ? 'underline' : 'none' }}>
                        {t("commons.meters")}
                    </Text>
                </View>
            </View>

            {scorecards.map((scorecard) => renderScorecardTable(scorecard))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        margin: 10,
    },
    infoContainer: {
        flexDirection: "row",
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    gridContainer: {
        marginBottom: 30,
    },
    dataTable: {
        minWidth: 800,
    },
    firstColumn: {
        width: 80,
        justifyContent: 'center',
    },
    holeColumn: {
        width: 40,
        justifyContent: 'center',
    },
    totalColumn: {
        width: 60,
        justifyContent: 'center',
        borderLeftWidth: 2,
        borderLeftColor: '#333',
    },
    headerText: {
        fontWeight: 'bold',
        marginTop: 5,
    },
    holeNumber: {
        fontWeight: 'bold',
        fontSize: 10,
    },
    rowLabel: {
        fontWeight: '600',
        fontSize: 11,
    },
    cellValue: {
        fontSize: 10,
    },
    totalValue: {
        fontWeight: 'bold',
        fontSize: 11,
    },
    teeboxLabel: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    colorDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 5,
    },
});

export default ScorecardDisplay;