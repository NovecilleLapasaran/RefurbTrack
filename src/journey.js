import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Check } from 'lucide-react-native';
import { useStyles, useTheme } from './theme';
export function RepairJourney({ status }) {
  const { C } = useTheme();
  const s = useStyles(makeStyles);
  if(status==='Not Worth Repairing') return <View style={s.closed}><Text style={s.closedText}>Closed without repair</Text></View>;
  const step=['Sold','Released'].includes(status)?3:['Ready for Sale','Ready for Pickup','Unsold'].includes(status)?2:['Repairing','Waiting for Parts'].includes(status)?1:0;
  return <View accessibilityLabel={`Repair journey, ${['intake','repair','ready','paid'][step]}`} style={s.journey}>{['Intake','Repair','Ready','Paid'].map((label,i)=><View key={label} style={s.step}><View style={[s.track,i<=step&&s.filled]}>{i<step&&<Check size={14} color={C.onAccent}/>}</View><Text style={[s.label,i===step&&s.active]}>{label}</Text></View>)}</View>;
}
const makeStyles = ({ C, type }) => StyleSheet.create({journey:{flexDirection:'row',gap:6},step:{flex:1,gap:8},track:{height:20,borderRadius:10,backgroundColor:C.soft,alignItems:'center',justifyContent:'center'},filled:{backgroundColor:C.teal},label:{...type.small,textAlign:'center'},active:{color:C.teal,fontWeight:'700'},closed:{backgroundColor:C.dangerSoft,padding:16,borderRadius:16},closedText:{...type.label,color:C.danger}});
