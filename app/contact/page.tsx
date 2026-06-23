'use client';

import { useState } from "react";

// ─── Componente Iconițe SVG pentru Interfață ────────────────────────────────
const IconCopy = ({ size = 15 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
);

const IconCheck = ({ size = 15 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

// ─── Interfață și Componentă pentru Blocul de Fișier ─────────────────────────
interface FileBlockProps {
    fileName: string;
    codeRaw: string;
    children: React.ReactNode;
}

function FileBlock({ fileName, codeRaw, children }: FileBlockProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(codeRaw);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Eroare la copiere:", err);
        }
    };

    return (
        <div className="file-block">
            <div className="file-header">
                <div style={{ display: "flex", gap: "6px" }}>
                    <span className="file-dot dot-red"></span>
                    <span className="file-dot dot-yellow"></span>
                    <span className="file-dot dot-green"></span>
                </div>
                <span className="file-name">{fileName}</span>
                <button className="copy-btn" onClick={handleCopy}>
                    {copied ? <IconCheck size={13} /> : <IconCopy size={13} />}
                    {copied ? "Copiat!" : "Copiază"}
                </button>
            </div>
            <pre><code>{children}</code></pre>
        </div>
    );
}

// ─── Componenta Principală Exportată ─────────────────────────────────────────
export default function SourceCodeViewerPage() {

    // Codul sursă brut salvat pentru acțiunea de Copy-Paste perfectă
    const dbHelperCodeRaw = `using System.Data;
using MySql.Data.MySqlClient;

namespace Biblioteca
{
    public class DatabaseHelper
    {
        private static string connectionString =
            "Server=localhost;Port=3306;Database=Biblioteca;Uid=root;Pwd=;";

        public static DataTable ExecuteQuery(string query)
        {
            DataTable dt = new DataTable();
            using (MySqlConnection conn = new MySqlConnection(connectionString))
            using (MySqlCommand cmd = new MySqlCommand(query, conn))
            {
                conn.Open();
                MySqlDataAdapter adapter = new MySqlDataAdapter(cmd);
                adapter.Fill(dt);
            }
            return dt;
        }

        public static void ExecuteNonQuery(string query)
        {
            using (MySqlConnection conn = new MySqlConnection(connectionString))
            using (MySqlCommand cmd = new MySqlCommand(query, conn))
            {
                conn.Open();
                cmd.ExecuteNonQuery();
            }
        }
    }
}`;

    const formCodeRaw = `using Biblioteca;
using MaterialSkin;
using System;
using System.Data;
using System.IO;
using System.Windows.Forms;
using iTextSharp.text;
using iTextSharp.text.pdf;
using iTextFont = iTextSharp.text.Font;
using iTextRectangle = iTextSharp.text.Rectangle;
using MaterialSkin.Controls;
using MySql.Data.MySqlClient;
using System.Collections.Generic;
using System.ComponentModel;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WindowsFormsApp2
{
    public partial class Form1 : MaterialForm
    {
        public Form1()
        {
            InitializeComponent();
        }

        private void Form1_Load(object sender, EventArgs e)
        {
            LoadCarti();
        }

        private void LoadCarti()
        {
            dataGridView1.DataSource = DatabaseHelper.ExecuteQuery("SELECT id, titlu, autor, an_publicare, isbn FROM carti");
            dataGridView1.Columns["id"].Visible = false;
        }

        private void insert(object sender, EventArgs e)
        {
            try
            {
                if (materialTextBox1.Text == "" || materialTextBox2.Text == "" ||
                    materialTextBox3.Text == "" || materialTextBox4.Text == "")
                {
                    MessageBox.Show("Toate campurile sunt obligatorii!",
                        "Atentie", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                    return;
                }

                int an;
                if (!int.TryParse(materialTextBox3.Text, out an))
                {
                    MessageBox.Show("Anul publicarii trebuie sa fie un numar!",
                        "Atentie", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                    return;
                }

                if (materialTextBox4.Text.Length < 10)
                {
                    MessageBox.Show("ISBN-ul trebuie sa aiba minim 10 caractere!",
                        "Atentie", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                    return;
                }

                string query = "INSERT INTO carti(titlu, autor, an_publicare, isbn) VALUES('" +
                               materialTextBox1.Text + "','" +
                               materialTextBox2.Text + "','" +
                               an + "','" +
                               materialTextBox4.Text + "')";

                DatabaseHelper.ExecuteNonQuery(query);
                LoadCarti();
                ClearFields();
                MessageBox.Show("Cartea a fost adaugata cu succes!",
                    "Succes", MessageBoxButtons.OK, MessageBoxIcon.Information);
            }
            catch (Exception ex)
            {
                MessageBox.Show("Eroare: " + ex.Message,
                    "Eroare", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        private void materialButton2_Click(object sender, EventArgs e)
        {
            string id = dataGridView1.CurrentRow.Cells["id"].Value.ToString();

            string query = "UPDATE carti SET titlu='" + materialTextBox1.Text +
               "', autor='" + materialTextBox2.Text +
               "', an_publicare='" + materialTextBox3.Text +
               "', isbn='" + materialTextBox4.Text +
               "' WHERE id=" + id;

            DatabaseHelper.ExecuteNonQuery(query);
            LoadCarti();
        }

        private void materialButton3_Click(object sender, EventArgs e)
        {
            if (dataGridView1.CurrentRow == null) return;

            string id = dataGridView1.CurrentRow.Cells[0].Value.ToString();

            if (MessageBox.Show("Ești sigur?", "Confirmare", MessageBoxButtons.YesNo) == DialogResult.Yes)
            {
                DatabaseHelper.ExecuteNonQuery("DELETE FROM carti WHERE id=" + id);
                LoadCarti();
                ClearFields();
            }
        }

        private void cellclick(object sender, DataGridViewCellEventArgs e)
        {
            if (e.RowIndex < 0) return;

            DataGridViewRow row = dataGridView1.Rows[e.RowIndex];
            materialTextBox1.Text = row.Cells["Titlu"].Value.ToString();
            materialTextBox2.Text = row.Cells["Autor"].Value.ToString();
            materialTextBox3.Text = row.Cells["An_publicare"].Value.ToString();
            materialTextBox4.Text = row.Cells["Isbn"].Value.ToString();
        }

        private void materialButton4_Click(object sender, EventArgs e)
        {
            string path = @"C:\\Users\\Public\\RaportCarti.pdf";

            Document doc = new Document(PageSize.A4, 50, 50, 70, 50);
            PdfWriter.GetInstance(doc, new FileStream(path, FileMode.Create));
            doc.Open();

            BaseColor albastru = new BaseColor(26, 86, 160);
            BaseColor albastruDeschis = new BaseColor(230, 241, 251);
            BaseColor gri = new BaseColor(100, 100, 100);

            PdfPTable header = new PdfPTable(1);
            header.WidthPercentage = 100;
            header.SpacingAfter = 20;

            PdfPCell headerCell = new PdfPCell();
            headerCell.BackgroundColor = albastru;
            headerCell.Border = iTextRectangle.NO_BORDER;
            headerCell.Padding = 20;

            iTextFont fontTitluMare = new iTextFont(iTextFont.FontFamily.HELVETICA, 22, iTextFont.BOLD, BaseColor.WHITE);
            iTextFont fontSubtitlu = new iTextFont(iTextFont.FontFamily.HELVETICA, 11, iTextFont.NORMAL, new BaseColor(180, 210, 240));

            Paragraph titluHeader = new Paragraph();
            titluHeader.Add(new Chunk("BIBLIOTECA\\n", fontTitluMare));
            titluHeader.Add(new Chunk("Raport complet al cartilor", fontSubtitlu));
            titluHeader.Alignment = Element.ALIGN_CENTER;

            headerCell.AddElement(titluHeader);
            header.AddCell(headerCell);
            doc.Add(header);

            DataTable dt = DatabaseHelper.ExecuteQuery("SELECT * FROM carti");

            PdfPTable infoBox = new PdfPTable(2);
            infoBox.WidthPercentage = 100;
            infoBox.SetWidths(new float[] { 1f, 1f });
            infoBox.SpacingAfter = 25;

            iTextFont fontInfo = new iTextFont(iTextFont.FontFamily.HELVETICA, 10, iTextFont.NORMAL, gri);
            iTextFont fontInfoBold = new iTextFont(iTextFont.FontFamily.HELVETICA, 10, iTextFont.BOLD, albastru);

            PdfPCell infoStanga = new PdfPCell();
            infoStanga.Border = iTextRectangle.LEFT_BORDER;
            infoStanga.BorderColor = albastru;
            infoStanga.BorderWidth = 3;
            infoStanga.BackgroundColor = albastruDeschis;
            infoStanga.Padding = 10;
            infoStanga.AddElement(new Paragraph("Data generarii", fontInfo));
            infoStanga.AddElement(new Paragraph(DateTime.Now.ToString("dd MMMM yyyy, HH:mm"), fontInfoBold));
            infoBox.AddCell(infoStanga);

            PdfPCell infoDreapta = new PdfPCell();
            infoDreapta.Border = iTextRectangle.LEFT_BORDER;
            infoDreapta.BorderColor = albastru;
            infoDreapta.BorderWidth = 3;
            infoDreapta.BackgroundColor = albastruDeschis;
            infoDreapta.Padding = 10;
            infoDreapta.AddElement(new Paragraph("Total carti in biblioteca", fontInfo));
            infoDreapta.AddElement(new Paragraph(dt.Rows.Count.ToString() + " carti", fontInfoBold));
            infoBox.AddCell(infoDreapta);

            doc.Add(infoBox);

            PdfPTable tabel = new PdfPTable(4);
            tabel.WidthPercentage = 100;
            tabel.SetWidths(new float[] { 3.5f, 2f, 1.5f, 2.5f });
            tabel.SpacingAfter = 20;
            tabel.HeaderRows = 1;

            iTextFont fontHeader = new iTextFont(iTextFont.FontFamily.HELVETICA, 10, iTextFont.BOLD, BaseColor.WHITE);
            string[] headere = { "Titlu", "Autor", "An Publicare", "ISBN" };

            foreach (string h in headere)
            {
                PdfPCell cell = new PdfPCell(new Phrase(h, fontHeader));
                cell.BackgroundColor = albastru;
                cell.HorizontalAlignment = Element.ALIGN_CENTER;
                cell.VerticalAlignment = Element.ALIGN_MIDDLE;
                cell.Padding = 10;
                cell.Border = iTextRectangle.NO_BORDER;
                tabel.AddCell(cell);
            }

            iTextFont fontRand = new iTextFont(iTextFont.FontFamily.HELVETICA, 10, iTextFont.NORMAL, new BaseColor(40, 40, 40));
            BaseColor albAlternant = new BaseColor(245, 249, 254);

            for (int i = 0; i < dt.Rows.Count; i++)
            {
                BaseColor bgColor = (i % 2 == 0) ? BaseColor.WHITE : albAlternant;
                string[] valori = {
                    dt.Rows[i]["titlu"].ToString(),
                    dt.Rows[i]["autor"].ToString(),
                    dt.Rows[i]["an_publicare"].ToString(),
                    dt.Rows[i]["isbn"].ToString()
                };

                foreach (string val in valori)
                {
                    PdfPCell cell = new PdfPCell(new Phrase(val, fontRand));
                    cell.BackgroundColor = bgColor;
                    cell.Padding = 8;
                    cell.Border = iTextRectangle.BOTTOM_BORDER;
                    cell.BorderColor = new BaseColor(220, 230, 240);
                    cell.BorderWidth = 0.5f;
                    tabel.AddCell(cell);
                }
            }

            doc.Add(tabel);

            PdfPTable footer = new PdfPTable(1);
            footer.WidthPercentage = 100;

            PdfPCell footerCell = new PdfPCell();
            footerCell.BackgroundColor = new BaseColor(245, 245, 245);
            footerCell.Border = iTextRectangle.TOP_BORDER;
            footerCell.BorderColor = albastru;
            footerCell.BorderWidth = 2;
            footerCell.Padding = 10;

            iTextFont fontFooter = new iTextFont(iTextFont.FontFamily.HELVETICA, 9, iTextFont.ITALIC, gri);
            Paragraph footerText = new Paragraph("Generat automat de sistemul Biblioteca  •  " + DateTime.Now.ToString("yyyy"), fontFooter);
            footerText.Alignment = Element.ALIGN_CENTER;
            footerCell.AddElement(footerText);
            footer.AddCell(footerCell);
            doc.Add(footer);

            doc.Close();

            MessageBox.Show("PDF generat cu succes!", "Succes", MessageBoxButtons.OK, MessageBoxIcon.Information);
            System.Diagnostics.Process.Start(path);
        }

        private void ClearFields()
        {
            materialTextBox1.Text = "";
            materialTextBox2.Text = "";
            materialTextBox3.Text = "";
            materialTextBox4.Text = "";
        }
    }
}`;

    return (
        <>
            <style>{`
                *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

                body {
                    background: #1e1e2e;
                    color: #cdd6f4;
                    font-family: 'Consolas', 'Courier New', monospace;
                    font-size: 14px;
                    line-height: 1.7;
                    padding: 40px 20px;
                }

                .container {
                    max-width: 960px;
                    margin: 0 auto;
                }

                .file-block {
                    background: #181825;
                    border: 1px solid #313244;
                    border-radius: 8px;
                    margin-bottom: 36px;
                    overflow: hidden;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
                }

                .file-header {
                    background: #11111b;
                    border-bottom: 1px solid #313244;
                    padding: 12px 20px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }

                .file-dot {
                    width: 12px; height: 12px; border-radius: 50%; display: inline-block;
                }
                .dot-red   { background: #f38ba8; }
                .dot-yellow{ background: #f9e2af; }
                .dot-green { background: #a6e3a1; }

                .file-name {
                    margin-left: 10px;
                    color: #89b4fa;
                    font-size: 13px;
                    letter-spacing: 0.04em;
                    font-weight: 500;
                }

                .copy-btn {
                    background: #1e1e2e;
                    border: 1px solid #313244;
                    color: #a6adc8;
                    padding: 4px 10px;
                    border-radius: 4px;
                    font-family: inherit;
                    font-size: 12px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    transition: all 0.2s ease;
                }

                .copy-btn:hover {
                    background: #313244;
                    color: #cdd6f4;
                    border-color: #45475a;
                }

                pre {
                    padding: 24px 28px;
                    overflow-x: auto;
                    white-space: pre;
                    tab-size: 4;
                    font-size: 13.5px;
                    line-height: 1.75;
                }

                /* Highlighting clases */
                .kw  { color: #cba6f7; font-weight: bold; }  /* keywords */
                .ty  { color: #89dceb; }                     /* types */
                .str { color: #a6e3a1; }                     /* strings */
                .cm  { color: #6c7086; font-style: italic; } /* comments */
                .nm  { color: #fab387; }                     /* numbers */
                .fn  { color: #89b4fa; }                     /* functions/methods */
                .ns  { color: #f9e2af; }                     /* namespaces */
                .op  { color: #94e2d5; }                     /* operators */
            `}</style>

            <div className="container">

                {/* FIȘIERUL 1: DatabaseHelper.cs */}
                <FileBlock fileName="DatabaseHelper.cs" codeRaw={dbHelperCodeRaw}>
                    <span className="kw">using</span> <span className="ns">System.Data</span>;< {"\n"}
                    <span className="kw">using</span> <span className="ns">MySql.Data.MySqlClient</span>;< {"\n\n"}
                    <span className="kw">namespace</span> <span className="ns">Biblioteca</span>{"\n"}
                    {"{"}{"\n"}
                    {"    "}<span className="kw">public class</span> <span className="ty">DatabaseHelper</span>{"\n"}
                    {"    "}{"{"}{"\n"}
                    {"        "}<span className="kw">private static string</span> connectionString <span className="op">=</span>{"\n"}
                    {"            "}<span className="str">"Server=localhost;Port=3306;Database=Biblioteca;Uid=root;Pwd=;"</span>;{"\n\n"}
                    {"        "}<span className="kw">public static</span> <span className="ty">DataTable</span> <span className="fn">ExecuteQuery</span>(<span className="kw">string</span> query){"\n"}
                    {"        "}{"{"}{"\n"}
                    {"            "}<span className="ty">DataTable</span> dt <span className="op">=</span> <span className="kw">new</span> <span className="ty">DataTable</span>();{"\n"}
                    {"            "}<span className="kw">using</span> (<span className="ty">MySqlConnection</span> conn <span className="op">=</span> <span className="kw">new</span> <span className="fn">MySqlConnection</span>(connectionString)){"\n"}
                    {"            "}<span className="kw">using</span> (<span className="ty">MySqlCommand</span> cmd <span className="op">=</span> <span className="kw">new</span> <span className="fn">MySqlCommand</span>(query, conn)){"\n"}
                    {"            "}{"{"}{"\n"}
                    {"                "}conn.<span className="fn">Open</span>();{"\n"}
                    {"                "}<span className="ty">MySqlDataAdapter</span> adapter <span className="op">=</span> <span className="kw">new</span> <span className="fn">MySqlDataAdapter</span>(cmd);{"\n"}
                    {"                "}adapter.<span className="fn">Fill</span>(dt);{"\n"}
                    {"            "}{"}"}{"\n"}
                    {"            "}<span className="kw">return</span> dt;{"\n"}
                    {"        "}{"}"}{"\n\n"}
                    {"        "}<span className="kw">public static void</span> <span className="fn">ExecuteNonQuery</span>(<span className="kw">string</span> query){"\n"}
                    {"        "}{"{"}{"\n"}
                    {"            "}<span className="kw">using</span> (<span className="ty">MySqlConnection</span> conn <span className="op">=</span> <span className="kw">new</span> <span className="fn">MySqlConnection</span>(connectionString)){"\n"}
                    {"            "}<span className="kw">using</span> (<span className="ty">MySqlCommand</span> cmd <span className="op">=</span> <span className="kw">new</span> <span className="fn">MySqlCommand</span>(query, conn)){"\n"}
                    {"            "}{"{"}{"\n"}
                    {"                "}conn.<span className="fn">Open</span>();{"\n"}
                    {"                "}cmd.<span className="fn">ExecuteNonQuery</span>();{"\n"}
                    {"            "}{"}"}{"\n"}
                    {"        "}{"}"}{"\n"}
                    {"    "}{"}"}{"\n"}
                    {"}"}
                </FileBlock>

                {/* FIȘIERUL 2: Form1.cs */}
                <FileBlock fileName="Form1.cs" codeRaw={formCodeRaw}>
                    <span className="kw">using</span> <span className="ns">Biblioteca</span>;{"\n"}
                    <span className="kw">using</span> <span className="ns">MaterialSkin</span>;{"\n"}
                    <span className="kw">using</span> <span className="ns">System</span>;{"\n"}
                    <span className="kw">using</span> <span className="ns">System.Data</span>;{"\n"}
                    <span className="kw">using</span> <span className="ns">System.IO</span>;{"\n"}
                    <span className="kw">using</span> <span className="ns">System.Windows.Forms</span>;{"\n"}
                    <span className="kw">using</span> <span className="ns">iTextSharp.text</span>;{"\n"}
                    <span className="kw">using</span> <span className="ns">iTextSharp.text.pdf</span>;{"\n"}
                    <span className="kw">using</span> <span className="ty">iTextFont</span> <span className="op">=</span> <span className="ns">iTextSharp.text</span>.<span className="ty">Font</span>;{"\n"}
                    <span className="kw">using</span> <span className="ty">iTextRectangle</span> <span className="op">=</span> <span className="ns">iTextSharp.text</span>.<span className="ty">Rectangle</span>;{"\n"}
                    <span className="kw">using</span> <span className="ns">MaterialSkin.Controls</span>;{"\n"}
                    <span className="kw">using</span> <span className="ns">MySql.Data.MySqlClient</span>;{"\n"}
                    <span className="kw">using</span> <span className="ns">System.Collections.Generic</span>;{"\n"}
                    <span className="kw">using</span> <span className="ns">System.ComponentModel</span>;{"\n"}
                    <span className="kw">using</span> <span className="ns">System.Drawing</span>;{"\n"}
                    <span className="kw">using</span> <span className="ns">System.Linq</span>;{"\n"}
                    <span className="kw">using</span> <span className="ns">System.Text</span>;{"\n"}
                    <span className="kw">using</span> <span className="ns">System.Threading.Tasks</span>;{"\n\n"}
                    <span className="kw">namespace</span> <span className="ns">WindowsFormsApp2</span>{"\n"}
                    {"{"}{"\n"}
                    {"    "}<span className="kw">public partial class</span> <span className="ty">Form1</span> <span className="op">:</span> <span className="ty">MaterialForm</span>{"\n"}
                    {"    "}{"{"}{"\n"}
                    {"        "}<span className="kw">public</span> <span className="fn">Form1</span>(){"\n"}
                    {"        "}{"{"}{"\n"}
                    {"            "}<span className="fn">InitializeComponent</span>();{"\n"}
                    {"        "}{"}"}{"\n\n"}
                    {"        "}<span className="kw">private void</span> <span className="fn">Form1_Load</span>(<span className="kw">object</span> sender, <span className="ty">EventArgs</span> e){"\n"}
                    {"        "}{"{"}{"\n"}
                    {"            "}<span className="fn">LoadCarti</span>();{"\n"}
                    {"        "}{"}"}{"\n\n"}
                    {"        "}<span className="kw">private void</span> <span className="fn">LoadCarti</span>(){"\n"}
                    {"        "}{"{"}{"\n"}
                    {"            "}dataGridView1.<span className="fn">DataSource</span> <span className="op">=</span> <span className="ty">DatabaseHelper</span>.<span className="fn">ExecuteQuery</span>(<span className="str">"SELECT id, titlu, autor, an_publicare, isbn FROM carti"</span>);{"\n"}
                    {"            "}dataGridView1.Columns[<span className="str">"id"</span>].Visible <span className="op">=</span> <span className="kw">false</span>;{"\n"}
                    {"        "}{"}"}{"\n\n"}
                    {"        "}<span className="kw">private void</span> <span className="fn">insert</span>(<span className="kw">object</span> sender, <span className="ty">EventArgs</span> e){"\n"}
                    {"        "}{"{"}{"\n"}
                    {"            "}<span className="kw">try</span>{"\n"}
                    {"            "}{"{"}{"\n"}
                    {"                "}<span className="cm">// Verifici campuri goale</span>{"\n"}
                    {"                "}<span className="kw">if</span> (materialTextBox1.Text <span className="op">==</span> <span className="str">""</span> <span className="op">||</span> materialTextBox2.Text <span className="op">==</span> <span className="str">""</span> <span className="op">||</span>{"\n"}
                    {"                    "}materialTextBox3.Text <span className="op">==</span> <span className="str">""</span> <span className="op">||</span> materialTextBox4.Text <span className="op">==</span> <span className="str">""</span>){"\n"}
                    {"                "}{"{"}{"\n"}
                    {"                    "}<span className="ty">MessageBox</span>.<span className="fn">Show</span>(<span className="str">"Toate campurile sunt obligatorii!"</span>,{"\n"}
                    {"                        "}<span className="str">"Atentie"</span>, <span className="ty">MessageBoxButtons</span>.OK, <span className="ty">MessageBoxIcon</span>.Warning);{"\n"}
                    {"                    "}<span className="kw">return</span>;{"\n"}
                    {"                "}{"}"}{"\n\n"}
                    {"                "}<span className="cm">// Verifici ca anul e numar</span>{"\n"}
                    {"                "}<span className="kw">int</span> an;{"\n"}
                    {"                "}<span className="kw">if</span> (<span className="op">!</span><span className="kw">int</span>.<span className="fn">TryParse</span>(materialTextBox3.Text, <span className="kw">out</span> an)){"\n"}
                    {"                "}{"{"}{"\n"}
                    {"                    "}<span className="ty">MessageBox</span>.<span className="fn">Show</span>(<span className="str">"Anul publicarii trebuie sa fie un numar!"</span>,{"\n"}
                    {"                        "}<span className="str">"Atentie"</span>, <span className="ty">MessageBoxButtons</span>.OK, <span className="ty">MessageBoxIcon</span>.Warning);{"\n"}
                    {"                    "}<span className="kw">return</span>;{"\n"}
                    {"                "}{"}"}{"\n\n"}
                    {"                "}<span className="cm">// Verifici lungimea ISBN</span>{"\n"}
                    {"                "}<span className="kw">if</span> (materialTextBox4.Text.Length < span className="op">&lt;</span > <span className="nm">10</span>){"\n"}
                    {"                "}{"{"}{"\n"}
                    {"                    "}<span className="ty">MessageBox</span>.<span className="fn">Show</span>(<span className="str">"ISBN-ul trebuie sa aiba minim 10 caractere!"</span>,{"\n"}
                    {"                        "}<span className="str">"Atentie"</span>, <span className="ty">MessageBoxButtons</span>.OK, <span className="ty">MessageBoxIcon</span>.Warning);{"\n"}
                    {"                    "}<span className="kw">return</span>;{"\n"}
                    {"                "}{"}"}{"\n\n"}
                    {"                "}<span className="kw">string</span> query <span className="op">=</span> <span className="str">"INSERT INTO carti(titlu, autor, an_publicare, isbn) VALUES('"</span> <span className="op">+</span>{"\n"}
                    {"                               "}materialTextBox1.Text <span className="op">+</span> <span className="str">"','"</span> <span className="op">+</span>{"\n"}
                    {"                               "}materialTextBox2.Text <span className="op">+</span> <span className="str">"','"</span> <span className="op">+</span>{"\n"}
                    {"                               "}an <span className="op">+</span> <span className="str">"','"</span> <span className="op">+</span>{"\n"}
                    {"                               "}materialTextBox4.Text <span className="op">+</span> <span className="str">"')"</span>;{"\n\n"}
                    {"                "}<span className="ty">DatabaseHelper</span>.<span className="fn">ExecuteNonQuery</span>(query);{"\n"}
                    {"                "}<span className="fn">LoadCarti</span>();{"\n"}
                    {"                "}<span className="fn">ClearFields</span>();{"\n"}
                    {"                "}<span className="ty">MessageBox</span>.<span className="fn">Show</span>(<span className="str">"Cartea a fost adaugata cu succes!"</span>,{"\n"}
                    {"                    "}<span className="str">"Succes"</span>, <span className="ty">MessageBoxButtons</span>.OK, <span className="ty">MessageBoxIcon</span>.Information);{"\n"}
                    {"            "}{"}"} <span className="kw">catch</span> (<span className="ty">Exception</span> ex){"\n"}
                    {"            "}{"{"}{"\n"}
                    {"                "}<span className="ty">MessageBox</span>.<span className="fn">Show</span>(<span className="str">"Eroare: "</span> <span className="op">+</span> ex.Message,{"\n"}
                    {"                    "}<span className="str">"Eroare"</span>, <span className="ty">MessageBoxButtons</span>.OK, <span className="ty">MessageBoxIcon</span>.Error);{"\n"}
                    {"            "}{"}"}{"\n"}
                    {"        "}{"}"}{"\n\n"}
                    {"        "}<span className="kw">private void</span> <span className="fn">materialButton2_Click</span>(<span className="kw">object</span> sender, <span className="ty">EventArgs</span> e){"\n"}
                    {"        "}{"{"}{"\n"}
                    {"            "}<span className="kw">string</span> id <span className="op">=</span> dataGridView1.CurrentRow.Cells[<span className="str">"id"</span>].Value.<span className="fn">ToString</span>();{"\n\n"}
                    {"            "}<span className="kw">string</span> query <span className="op">=</span> <span className="str">"UPDATE carti SET titlu='"</span> <span className="op">+</span> materialTextBox1.Text <span className="op">+</span>{"\n"}
                    {"               "}<span className="str">"', autor='"</span> <span className="op">+</span> materialTextBox2.Text <span className="op">+</span>{"\n"}
                    {"               "}<span className="str">"', an_publicare='"</span> <span className="op">+</span> materialTextBox3.Text <span className="op">+</span>{"\n"}
                    {"               "}<span className="str">"', isbn='"</span> <span className="op">+</span> materialTextBox4.Text <span className="op">+</span>{"\n"}
                    {"               "}<span className="str">"' WHERE id="</span> <span className="op">+</span> id;{"\n\n"}
                    {"            "}<span className="ty">DatabaseHelper</span>.<span className="fn">ExecuteNonQuery</span>(query);{"\n"}
                    {"            "}<span className="fn">LoadCarti</span>();{"\n"}
                    {"        "}{"}"}{"\n\n"}
                    {"        "}<span className="kw">private void</span> <span className="fn">materialButton3_Click</span>(<span className="kw">object</span> sender, <span className="ty">EventArgs</span> e){"\n"}
                    {"        "}{"{"}{"\n"}
                    {"            "}<span className="kw">if</span> (dataGridView1.CurrentRow <span className="op">==</span> <span className="kw">null</span>) <span className="kw">return</span>;{"\n\n"}
                    {"            "}<span className="kw">string</span> id <span className="op">=</span> dataGridView1.CurrentRow.Cells[<span className="nm">0</span>].Value.<span className="fn">ToString</span>();{"\n\n"}
                    {"            "}<span className="kw">if</span> (<span className="ty">MessageBox</span>.<span className="fn">Show</span>(<span className="str">"Ești sigur?"</span>, <span className="str">"Confirmare"</span>, <span className="ty">MessageBoxButtons</span>.YesNo) <span className="op">==</span> <span className="ty">DialogResult</span>.Yes){"\n"}
                    {"            "}{"{"}{"\n"}
                    {"                "}<span className="ty">DatabaseHelper</span>.<span className="fn">ExecuteNonQuery</span>(<span className="str">"DELETE FROM carti WHERE id="</span> <span className="op">+</span> id);{"\n"}
                    {"                "}<span className="fn">LoadCarti</span>();{"\n"}
                    {"                "}<span className="fn">ClearFields</span>();{"\n"}
                    {"            "}{"}"}{"\n"}
                    {"        "}{"}"}{"\n\n"}
                    {"        "}<span className="kw">private void</span> <span className="fn">cellclick</span>(<span className="kw">object</span> sender, <span className="ty">DataGridViewCellEventArgs</span> e){"\n"}
                    {"        "}{"{"}{"\n"}
                    {"            "}<span className="kw">if</span> (e.RowIndex < span className="op">&lt;</span > <span className="nm">0</span>) <span className="kw">return</span>;{"\n\n"}
                    {"            "}<span className="ty">DataGridViewRow</span> row <span className="op">=</span> dataGridView1.Rows[e.RowIndex];{"\n"}
                    {"            "}materialTextBox1.Text <span className="op">=</span> row.Cells[<span className="str">"Titlu"</span>].Value.<span className="fn">ToString</span>();{"\n"}
                    {"            "}materialTextBox2.Text <span className="op">=</span> row.Cells[<span className="str">"Autor"</span>].Value.<span className="fn">ToString</span>();{"\n"}
                    {"            "}materialTextBox3.Text <span className="op">=</span> row.Cells[<span className="str">"An_publicare"</span>].Value.<span className="fn">ToString</span>();{"\n"}
                    {"            "}materialTextBox4.Text <span className="op">=</span> row.Cells[<span className="str">"Isbn"</span>].Value.<span className="fn">ToString</span>();{"\n"}
                    {"        "}{"}"}{"\n\n"}
                    {"        "}<span className="kw">private void</span> <span className="fn">materialButton4_Click</span>(<span className="kw">object</span> sender, <span className="ty">EventArgs</span> e){"\n"}
                    {"        "}{"{"}{"\n"}
                    {"            "}<span className="kw">string</span> path <span className="op">=</span> <span className="str">@"C:\Users\Public\RaportCarti.pdf"</span>;{"\n\n"}
                    {"            "}<span className="ty">Document</span> doc <span className="op">=</span> <span className="kw">new</span> <span className="ty">Document</span>(<span className="ty">PageSize</span>.A4, <span className="nm">50</span>, <span className="nm">50</span>, <span className="nm">70</span>, <span className="nm">50</span>);{"\n"}
                    {"            "}<span className="ty">PdfWriter</span>.<span className="fn">GetInstance</span>(doc, <span className="kw">new</span> <span className="ty">FileStream</span>(path, <span className="ty">FileMode</span>.Create));{"\n"}
                    {"            "}doc.<span className="fn">Open</span>();{"\n\n"}
                    {"            "}<span className="ty">BaseColor</span> albastru <span className="op">=</span> <span className="kw">new</span> <span className="ty">BaseColor</span>(<span className="nm">26</span>, <span className="nm">86</span>, <span className="nm">160</span>);{"\n"}
                    {"            "}<span className="ty">BaseColor</span> albastruDeschis <span className="op">=</span> <span className="kw">new</span> <span className="ty">BaseColor</span>(<span className="nm">230</span>, <span className="nm">241</span>, <span className="nm">251</span>);{"\n"}
                    {"            "}<span className="ty">BaseColor</span> gri <span className="op">=</span> <span className="kw">new</span> <span className="ty">BaseColor</span>(<span className="nm">100</span>, <span className="nm">100</span>, <span className="nm">100</span>);{"\n\n"}
                    {"            "}<span className="cm">// ====== HEADER ======</span>{"\n"}
                    {"            "}<span className="ty">PdfPTable</span> header <span className="op">=</span> <span className="kw">new</span> <span className="ty">PdfPTable</span>(<span className="nm">1</span>);{"\n"}
                    {"            "}header.WidthPercentage <span className="op">=</span> <span className="nm">100</span>;{"\n"}
                    {"            "}header.SpacingAfter <span className="op">=</span> <span className="nm">20</span>;{"\n\n"}
                    {"            "}<span className="ty">PdfPCell</span> headerCell <span className="op">=</span> <span className="kw">new</span> <span className="ty">PdfPCell</span>();{"\n"}
                    {"            "}headerCell.BackgroundColor <span className="op">=</span> albastru;{"\n"}
                    {"            "}headerCell.Border <span className="op">=</span> <span className="ty">iTextRectangle</span>.NO_BORDER;{"\n"}
                    {"            "}headerCell.Padding <span className="op">=</span> <span className="nm">20</span>;{"\n\n"}
                    {"            "}<span className="ty">iTextFont</span> fontTitluMare <span className="op">=</span> <span className="kw">new</span> <span className="ty">iTextFont</span>(<span className="ty">iTextFont</span>.<span className="ty">FontFamily</span>.HELVETICA, <span className="nm">22</span>, <span className="ty">iTextFont</span>.BOLD, <span className="ty">BaseColor</span>.WHITE);{"\n"}
                    {"            "}<span className="ty">iTextFont</span> fontSubtitlu <span className="op">=</span> <span className="kw">new</span> <span className="ty">iTextFont</span>(<span className="ty">iTextFont</span>.<span className="ty">FontFamily</span>.HELVETICA, <span className="nm">11</span>, <span className="ty">iTextFont</span>.NORMAL, <span className="kw">new</span> <span className="ty">BaseColor</span>(<span className="nm">180</span>, <span className="nm">210</span>, <span className="nm">240</span>));{"\n\n"}
                    {"            "}<span className="ty">Paragraph</span> titluHeader <span className="op">=</span> <span className="kw">new</span> <span className="ty">Paragraph</span>();{"\n"}
                    {"            "}titluHeader.<span className="fn">Add</span>(<span className="kw">new</span> <span className="ty">Chunk</span>(<span className="str">"BIBLIOTECA\n"</span>, fontTitluMare));{"\n"}
                    {"            "}titluHeader.<span className="fn">Add</span>(<span className="kw">new</span> <span className="ty">Chunk</span>(<span className="str">"Raport complet al cartilor"</span>, fontSubtitlu));{"\n"}
                    {"            "}titluHeader.Alignment <span className="op">=</span> <span className="ty">Element</span>.ALIGN_CENTER;{"\n\n"}
                    {"            "}headerCell.<span className="fn">AddElement</span>(titluHeader);{"\n"}
                    {"            "}header.<span className="fn">AddCell</span>(headerCell);{"\n"}
                    {"            "}doc.<span className="fn">Add</span>(header);{"\n\n"}
                    {"            "}<span className="cm">// ====== INFO BOX ======</span>{"\n"}
                    {"            "}<span className="ty">DataTable</span> dt <span className="op">=</span> <span className="ty">DatabaseHelper</span>.<span className="fn">ExecuteQuery</span>(<span className="str">"SELECT * FROM carti"</span>);{"\n\n"}
                    {"            "}<span className="ty">PdfPTable</span> infoBox <span className="op">=</span> <span className="kw">new</span> <span className="ty">PdfPTable</span>(<span className="nm">2</span>);{"\n"}
                    {"            "}infoBox.WidthPercentage <span className="op">=</span> <span className="nm">100</span>;{"\n"}
                    {"            "}infoBox.<span className="fn">SetWidths</span>(<span className="kw">new float</span>[] <span className="op">{"{"}</span> <span className="nm">1f</span>, <span className="nm">1f</span> <span className="op">{"}"}</span>);{"\n"}
                    {"            "}infoBox.SpacingAfter <span className="op">=</span> <span className="nm">25</span>;{"\n\n"}
                    {"            "}<span className="ty">iTextFont</span> fontInfo <span className="op">=</span> <span className="kw">new</span> <span className="ty">iTextFont</span>(<span className="ty">iTextFont</span>.<span className="ty">FontFamily</span>.HELVETICA, <span className="nm">10</span>, <span className="ty">iTextFont</span>.NORMAL, gri);{"\n"}
                    {"            "}<span className="ty">iTextFont</span> fontInfoBold <span className="op">=</span> <span className="kw">new</span> <span className="ty">iTextFont</span>(<span className="ty">iTextFont</span>.<span className="ty">FontFamily</span>.HELVETICA, <span className="nm">10</span>, <span className="ty">iTextFont</span>.BOLD, albastru);{"\n\n"}
                    {"            "}<span className="ty">PdfPCell</span> infoStanga <span className="op">=</span> <span className="kw">new</span> <span className="ty">PdfPCell</span>();{"\n"}
                    {"            "}infoStanga.Border <span className="op">=</span> <span className="ty">iTextRectangle</span>.LEFT_BORDER;{"\n"}
                    {"            "}infoStanga.BorderColor <span className="op">=</span> albastru;{"\n"}
                    {"            "}infoStanga.BorderWidth <span className="op">=</span> <span className="nm">3</span>;{"\n"}
                    {"            "}infoStanga.BackgroundColor <span className="op">=</span> albastruDeschis;{"\n"}
                    {"            "}infoStanga.Padding <span className="op">=</span> <span className="nm">10</span>;{"\n"}
                    {"            "}infoStanga.<span className="fn">AddElement</span>(<span className="kw">new</span> <span className="ty">Paragraph</span>(<span className="str">"Data generarii"</span>, fontInfo));{"\n"}
                    {"            "}infoStanga.<span className="fn">AddElement</span>(<span className="kw">new</span> <span className="ty">Paragraph</span>(<span className="ty">DateTime</span>.Now.<span className="fn">ToString</span>(<span className="str">"dd MMMM yyyy, HH:mm"</span>), fontInfoBold));{"\n"}
                    {"            "}infoBox.<span className="fn">AddCell</span>(infoStanga);{"\n\n"}
                    {"            "}<span className="ty">PdfPCell</span> infoDreapta <span className="op">=</span> <span className="kw">new</span> <span className="ty">PdfPCell</span>();{"\n"}
                    {"            "}infoDreapta.Border <span className="op">=</span> <span className="ty">iTextRectangle</span>.LEFT_BORDER;{"\n"}
                    {"            "}infoDreapta.BorderColor <span className="op">=</span> albastru;{"\n"}
                    {"            "}infoDreapta.BorderWidth <span className="op">=</span> <span className="nm">3</span>;{"\n"}
                    {"            "}infoDreapta.BackgroundColor <span className="op">=</span> albastruDeschis;{"\n"}
                    {"            "}infoDreapta.Padding <span className="op">=</span> <span className="nm">10</span>;{"\n"}
                    {"            "}infoDreapta.<span className="fn">AddElement</span>(<span className="kw">new</span> <span className="ty">Paragraph</span>(<span className="str">"Total carti in biblioteca"</span>, fontInfo));{"\n"}
                    {"            "}infoDreapta.<span className="fn">AddElement</span>(<span className="kw">new</span> <span className="ty">Paragraph</span>(dt.Rows.Count.<span className="fn">ToString</span>() <span className="op">+</span> <span className="str">" carti"</span>, fontInfoBold));{"\n"}
                    {"            "}infoBox.<span className="fn">AddCell</span>(infoDreapta);{"\n\n"}
                    {"            "}doc.<span className="fn">Add</span>(infoBox);{"\n\n"}
                    {"            "}<span className="cm">// ====== TABEL ======</span>{"\n"}
                    {"            "}<span className="ty">PdfPTable</span> tabel <span className="op">=</span> <span className="kw">new</span> <span className="ty">PdfPTable</span>(<span className="nm">4</span>);{"\n"}
                    {"            "}tabel.WidthPercentage <span className="op">=</span> <span className="nm">100</span>;{"\n"}
                    {"            "}tabel.<span className="fn">SetWidths</span>(<span className="kw">new float</span>[] <span className="op">{"{"}</span> <span className="nm">3.5f</span>, <span className="nm">2f</span>, <span className="nm">1.5f</span>, <span className="nm">2.5f</span> <span className="op">{"}"}</span>);{"\n"}
                    {"            "}tabel.SpacingAfter <span className="op">=</span> <span className="nm">20</span>;{"\n"}
                    {"            "}tabel.HeaderRows <span className="op">=</span> <span className="nm">1</span>;{"\n\n"}
                    {"            "}<span className="ty">iTextFont</span> fontHeader <span className="op">=</span> <span className="kw">new</span> <span className="ty">iTextFont</span>(<span className="ty">iTextFont</span>.<span className="ty">FontFamily</span>.HELVETICA, <span className="nm">10</span>, <span className="ty">iTextFont</span>.BOLD, <span className="ty">BaseColor</span>.WHITE);{"\n"}
                    {"            "}<span className="kw">string</span>[] headere <span className="op">=</span> <span className="op">{"{"}</span> <span className="str">"Titlu"</span>, <span className="str">"Autor"</span>, <span className="str">"An Publicare"</span>, <span className="str">"ISBN"</span> <span className="op">{"}"}</span>;{"\n\n"}
                    {"            "}<span className="kw">foreach</span> (<span className="kw">string</span> h <span className="kw">in</span> headere){"\n"}
                    {"            "}{"{"}{"\n"}
                    {"                "}<span className="ty">PdfPCell</span> cell <span className="op">=</span> <span className="kw">new</span> <span className="ty">PdfPCell</span>(<span className="kw">new</span> <span className="ty">Phrase</span>(h, fontHeader));{"\n"}
                    {"                "}cell.BackgroundColor <span className="op">=</span> albastru;{"\n"}
                    {"                "}cell.HorizontalAlignment <span className="op">=</span> <span className="ty">Element</span>.ALIGN_CENTER;{"\n"}
                    {"                "}cell.VerticalAlignment <span className="op">=</span> <span className="ty">Element</span>.ALIGN_MIDDLE;{"\n"}
                    {"                "}cell.Padding <span className="op">=</span> <span className="nm">10</span>;{"\n"}
                    {"                "}cell.Border <span className="op">=</span> <span className="ty">iTextRectangle</span>.NO_BORDER;{"\n"}
                    {"                "}tabel.<span className="fn">AddCell</span>(cell);{"\n"}
                    {"            "}{"}"}{"\n\n"}
                    {"            "}<span className="ty">iTextFont</span> fontRand <span className="op">=</span> <span className="kw">new</span> <span className="ty">iTextFont</span>(<span className="ty">iTextFont</span>.<span className="ty">FontFamily</span>.HELVETICA, <span className="nm">10</span>, <span className="ty">iTextFont</span>.NORMAL, <span className="kw">new</span> <span className="ty">BaseColor</span>(<span className="nm">40</span>, <span className="nm">40</span>, <span className="nm">40</span>));{"\n"}
                    {"            "}<span className="ty">BaseColor</span> albAlternant <span className="op">=</span> <span className="kw">new</span> <span className="ty">BaseColor</span>(<span className="nm">245</span>, <span className="nm">249</span>, <span className="nm">254</span>);{"\n\n"}
                    {"            "}<span className="kw">for</span> (<span className="kw">int</span> i <span className="op">=</span> <span className="nm">0</span>; i <span className="op">&lt;</span> dt.Rows.Count; i++){"\n"}
                    {"            "}{"{"}{"\n"}
                    {"                "}<span className="ty">BaseColor</span> bgColor <span className="op">=</span> (i <span className="op">%</span> <span className="nm">2</span> <span className="op">==</span> <span className="nm">0</span>) <span className="op">?</span> <span className="ty">BaseColor</span>.WHITE : albAlternant;{"\n"}
                    {"                "}<span className="kw">string</span>[] valori <span className="op">=</span> <span className="op">{"{"}</span>{"\n"}
                    {"                    "}dt.Rows[i][<span className="str">"titlu"</span>].<span className="fn">ToString</span>(),{"\n"}
                    {"                    "}dt.Rows[i][<span className="str">"autor"</span>].<span className="fn">ToString</span>(),{"\n"}
                    {"                    "}dt.Rows[i][<span className="str">"an_publicare"</span>].<span className="fn">ToString</span>(),{"\n"}
                    {"                    "}dt.Rows[i][<span className="str">"isbn"</span>].<span className="fn">ToString</span>(){"\n"}
                    {"                "}<span className="op">{"}"}</span>;{"\n\n"}
                    {"                "}<span className="kw">foreach</span> (<span className="kw">string</span> val <span className="kw">in</span> valori){"\n"}
                    {"                "}{"{"}{"\n"}
                    {"                    "}<span className="ty">PdfPCell</span> cell <span className="op">=</span> <span className="kw">new</span> <span className="ty">PdfPCell</span>(<span className="kw">new</span> <span className="ty">Phrase</span>(val, fontRand));{"\n"}
                    {"                    "}cell.BackgroundColor <span className="op">=</span> bgColor;{"\n"}
                    {"                    "}cell.Padding <span className="op">=</span> <span className="nm">8</span>;{"\n"}
                    {"                    "}cell.Border <span className="op">=</span> <span className="ty">iTextRectangle</span>.BOTTOM_BORDER;{"\n"}
                    {"                    "}cell.BorderColor <span className="op">=</span> <span className="kw">new</span> <span className="ty">BaseColor</span>(<span className="nm">220</span>, <span className="nm">230</span>, <span className="nm">240</span>);{"\n"}
                    {"                    "}cell.BorderWidth <span className="op">=</span> <span className="nm">0.5f</span>;{"\n"}
                    {"                    "}tabel.<span className="fn">AddCell</span>(cell);{"\n"}
                    {"                "}{"}"}{"\n"}
                    {"            "}{"}"}{"\n\n"}
                    {"            "}doc.<span className="fn">Add</span>(tabel);{"\n\n"}
                    {"            "}<span className="cm">// ====== FOOTER ======</span>{"\n"}
                    {"            "}<span className="ty">PdfPTable</span> footer <span className="op">=</span> <span className="kw">new</span> <span className="ty">PdfPTable</span>(<span className="nm">1</span>);{"\n"}
                    {"            "}footer.WidthPercentage <span className="op">=</span> <span className="nm">100</span>;{"\n\n"}
                    {"            "}<span className="ty">PdfPCell</span> footerCell <span className="op">=</span> <span className="kw">new</span> <span className="ty">PdfPCell</span>();{"\n"}
                    {"            "}footerCell.BackgroundColor <span className="op">=</span> <span className="kw">new</span> <span className="ty">BaseColor</span>(<span className="nm">245</span>, <span className="nm">245</span>, <span className="nm">245</span>);{"\n"}
                    {"            "}footerCell.Border <span className="op">=</span> <span className="ty">iTextRectangle</span>.TOP_BORDER;{"\n"}
                    {"            "}footerCell.BorderColor <span className="op">=</span> albastru;{"\n"}
                    {"            "}footerCell.BorderWidth <span className="op">=</span> <span className="nm">2</span>;{"\n"}
                    {"            "}footerCell.Padding <span className="op">=</span> <span className="nm">10</span>;{"\n\n"}
                    {"            "}<span className="ty">iTextFont</span> fontFooter <span className="op">=</span> <span className="kw">new</span> <span className="ty">iTextFont</span>(<span className="ty">iTextFont</span>.<span className="ty">FontFamily</span>.HELVETICA, <span className="nm">9</span>, <span className="ty">iTextFont</span>.ITALIC, gri);{"\n"}
                    {"            "}<span className="ty">Paragraph</span> footerText <span className="op">=</span> <span className="kw">new</span> <span className="ty">Paragraph</span>(<span className="str">"Generat automat de sistemul Biblioteca  •  "</span> <span className="op">+</span> <span className="ty">DateTime</span>.Now.<span className="fn">ToString</span>(<span className="str">"yyyy"</span>), fontFooter);{"\n"}
                    {"            "}footerText.Alignment <span className="op">=</span> <span className="ty">Element</span>.ALIGN_CENTER;{"\n"}
                    {"            "}footerCell.<span className="fn">AddElement</span>(footerText);{"\n"}
                    {"            "}footer.<span className="fn">AddCell</span>(footerCell);{"\n"}
                    {"            "}doc.<span className="fn">Add</span>(footer);{"\n\n"}
                    {"            "}doc.<span className="fn">Close</span>();{"\n\n"}
                    {"            "}<span className="ty">MessageBox</span>.<span className="fn">Show</span>(<span className="str">"PDF generat cu succes!"</span>, <span className="str">"Succes"</span>, <span className="ty">MessageBoxButtons</span>.OK, <span className="ty">MessageBoxIcon</span>.Information);{"\n"}
                    {"            "}<span className="ns">System.Diagnostics.Process</span>.<span className="fn">Start</span>(path);{"\n"}
                    {"        "}{"}"}{"\n\n"}
                    {"        "}<span className="kw">private void</span> <span className="fn">ClearFields</span>(){"\n"}
                    {"        "}{"{"}{"\n"}
                    {"            "}materialTextBox1.Text <span className="op">=</span> <span className="str">""</span>;{"\n"}
                    {"            "}materialTextBox2.Text <span className="op">=</span> <span className="str">""</span>;{"\n"}
                    {"            "}materialTextBox3.Text <span className="op">=</span> <span className="str">""</span>;{"\n"}
                    {"            "}materialTextBox4.Text <span className="op">=</span> <span className="str">""</span>;{"\n"}
                    {"        "}{"}"}{"\n"}
                    {"    "}{"}"}{"\n"}
                    {"}"}
                </FileBlock>

            </div>
        </>
    );
}