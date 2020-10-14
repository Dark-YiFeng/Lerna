export const gitRegex = /^git@(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?(([0-9]{1,3}.){3}[0-9]{1,3}|([0-9a-z_!~*'()-]+.)*([0-9a-z][0-9a-z-]{0,61})?[0-9a-z].[a-z]{2,6})(:[0-9]{1,4})?((\/?)|(\/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+\/?)$/i;

export const urlRegex = /^(http[s]?:)?\/\/[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/i;

export const mobileRegex = /^1[0-9]{10}$/;

export const emailRegex = /^[0-9a-zA-Z_]+@(([0-9a-zA-Z]+)[.]){1,2}[a-z]{2,3}$/;

export const domainRegex = /^[a-zA-z0-9]+-?\w+(\.\w+)+/;
