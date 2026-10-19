/** Where to report discrimination: the same for every case in the datasheet (สำนักงาน กสม.). */
export const reportingChannels = {
	office: 'สำนักงาน กสม.',
	officeFull: 'สำนักงานคณะกรรมการสิทธิมนุษยชนแห่งชาติ (สำนักงาน กสม.)',
	facebook: 'สำนักงานคณะกรรมการสิทธิมนุษยชนแห่งชาติ',
	// TODO(content): the official page URL; the datasheet only names the page
	facebookUrl: undefined as string | undefined,
	complaintsUrl: 'https://complaints.nhrc.or.th',
	hotline: '1377'
} as const;
