import React, { useState } from 'react';
import { View } from 'react-native';
import { Text, TouchableRipple, Icon } from 'react-native-paper';
import { useTheme } from '../../Components/Container';

interface ExpandableSectionProps {
    title: string;
    children: React.ReactNode;
    expanded?: boolean;
    required?: boolean;
}

const ExpandableSection: React.FC<ExpandableSectionProps> = ({
    title,
    children,
    expanded = true,
    required = false
}) => {
    const [isExpanded, setIsExpanded] = useState(expanded);
    const { colors } = useTheme();

    return (
        <View style={{ marginBottom: 16 }}>
            <TouchableRipple
                onPress={() => setIsExpanded(!isExpanded)}
                style={{
                    backgroundColor: colors.bg_secondary,
                    borderRadius: 8,
                    marginBottom: isExpanded ? 12 : 0,
                }}
            >
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: 16,
                }}>
                    <Text 
                        variant="titleMedium" 
                        style={{ 
                            fontWeight: 'bold',
                            color: colors.fa_primary 
                        }}
                    >
                        {title} {required && '*'}
                    </Text>
                    <Icon 
                        source={isExpanded ? "chevron-up" : "chevron-down"} 
                        size={24} 
                        color={colors.fa_primary}
                    />
                </View>
            </TouchableRipple>
            {isExpanded && (
                <View style={{ paddingHorizontal: 8 }}>
                    {children}
                </View>
            )}
        </View>
    );
};

export default ExpandableSection;
