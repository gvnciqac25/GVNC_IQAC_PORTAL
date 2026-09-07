# GVNC IQAC Data Portal

Modern lightweight portal for G. Venkataswamy Naidu College IQAC/NAAC Google Forms.

## Update Google Form links
Open `forms-data.js` and replace the empty `url:''` value for each form with its real Google Form URL.

## Structure
Home → Criterion → Metric/Form → Open Google Form

No department layer is included because all departments use the applicable forms.


## Admin Portal

Open `admin.html` for the new IQAC administrative dashboard.

Edit `admin-data.js` to add:
- Criterion-wise Master Google Sheet links
- Criterion-wise Google Form response Sheet links
- Criterion-wise raw Excel/Drive links

No passwords are stored in the JavaScript. The dashboard should be placed behind Google-account authentication / Apps Script before it is used with confidential resources.
