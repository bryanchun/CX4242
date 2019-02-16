#%%
import pandas as pd
import os
pwd = 'HW2-dev/Q1'
df_raw = pd.read_csv(f'{pwd}/all-ages.csv')
df_raw

#%%
column_idx = ['Major_category', 'Major', 'Employed', 'Unemployed', 'Unemployment_rate']
major_categories = ['Humanities & Liberal Arts', 'Computers & Mathematics']
df = df_raw[column_idx]
df = df[df.Major_category.isin(major_categories)]
df.Unemployment_rate = df.Unemployment_rate.map(lambda n: '{:.2%}'.format(n))
df = df.sort_values(by=['Major_category', 'Major'])
df.Major = df.Major.str.title()
df

#%%
import imgkit
import random
# Tutorial: https://medium.com/@andy.lane/convert-pandas-dataframes-to-images-using-imgkit-5da7e5108d55
def DataFrame_to_image(data, css, outputfile="out.png", format="png"):
    '''
    For rendering a Pandas DataFrame as an image.
    data: a pandas DataFrame
    css: a string containing rules for styling the output table. This must 
         contain both the opening an closing <style> tags.
    *outputimage: filename for saving of generated image
    *format: output format, as supported by IMGKit. Default is "png"
    '''
    fn = f"{pwd}/" + str(random.random()*100000000).split(".")[0] + ".html"
    
    try:
        os.remove(fn)
    except:
        None
    text_file = open(fn, "a")
    
    # write the CSS
    text_file.write(css)
    # write the HTML-ized Pandas DataFrame
    text_file.write(data.to_html())
    text_file.close()
    
    # See IMGKit options for full configuration,
    # e.g. cropping of final image
    imgkitoptions = {"format": format}
    
    imgkit.from_file(fn, outputfile, options=imgkitoptions)
    os.remove(fn)

css = """
<style type=\"text/css\">
table {
  color: #333;
  font-family: Helvetica, Arial, sans-serif;
  width: 640px;
  border-collapse:
  collapse; 
  border-spacing: 0;
}
td, th {
  border: 1px solid transparent; /* No more visible border */
  height: 30px;
}
th {
  background: #DFDFDF; /* Darken header a bit */
  font-weight: bold;
}
td {
  background: #FAFAFA;
  text-align: center;
}
table tr:nth-child(odd) td {
  background-color: white;
}
table tr:first-child th {
  text-align: center;
}
table td {
    text-align: right;
}
table td:first-child, table td:nth-child(2) {
    text-align: left;
}​

</style>
"""

df.rename(columns=lambda column_name: column_name.replace('_', ' '), inplace=True)

DataFrame_to_image(df, css, outputfile=f'{pwd}/table.png')

# df.to_html('table.html')
# subprocess.call(
#     'wkhtmltoimage -f png --width 0 table.html table.png', shell=True)