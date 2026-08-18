import { useState } from "react";
import { useAdminTable } from "./useAdminTable";
import { uploadMedia, MAX_IMAGE_MB } from "../lib/storage";
import { isIllustration } from "../lib/media";

const emptyCategory = { name: "", sort_order: 0 };
const emptyItem = { category_id: "", name: "", description: "", price: "", image_url: "", is_available: true, is_specialty: false, sort_order: 0 };

function ImageUploader({ url, onUploaded, onError }) {
  const [uploading, setUploading] = useState(false);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_IMAGE_MB * 1024 * 1024) {
      onError(`File is too large. Max ${MAX_IMAGE_MB}MB.`);
      return;
    }
    onError("");
    setUploading(true);
    try {
      const uploadedUrl = await uploadMedia(file, "menu");
      onUploaded(uploadedUrl);
    } catch (ex) {
      onError(ex.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      {url && (
        <div className={`h-24 w-24 bg-char-950 rounded-lg flex items-center justify-center ${isIllustration(url) ? "p-2" : ""}`}>
          <img
            src={url}
            alt="Preview"
            className={isIllustration(url) ? "h-full w-full object-contain" : "h-full w-full object-cover rounded-lg"}
          />
        </div>
      )}
      <label className="admin-btn-outline text-xs cursor-pointer inline-flex">
        {uploading ? "Uploading…" : "Upload Photo"}
        <input type="file" accept="image/*" onChange={handleFile} className="hidden" disabled={uploading} />
      </label>
    </div>
  );
}

export default function AdminMenu() {
  const categories = useAdminTable("menu_categories");
  const items = useAdminTable("menu_items");

  const [newCategory, setNewCategory] = useState(emptyCategory);
  const [newItem, setNewItem] = useState(emptyItem);
  const [editingItemId, setEditingItemId] = useState(null);
  const [editItem, setEditItem] = useState(emptyItem);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const addCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.name) return;
    setBusy(true);
    setErr("");
    try {
      await categories.insert(newCategory);
      setNewCategory(emptyCategory);
    } catch (ex) {
      setErr(ex.message);
    } finally {
      setBusy(false);
    }
  };

  const addItem = async (e) => {
    e.preventDefault();
    if (!newItem.name || !newItem.category_id) return;
    setBusy(true);
    setErr("");
    try {
      await items.insert({ ...newItem, price: newItem.price || "0" });
      setNewItem(emptyItem);
    } catch (ex) {
      setErr(ex.message);
    } finally {
      setBusy(false);
    }
  };

  const startEdit = (item) => {
    setEditingItemId(item.id);
    setEditItem(item);
  };

  const saveEdit = async () => {
    setBusy(true);
    setErr("");
    try {
      await items.update(editingItemId, editItem);
      setEditingItemId(null);
    } catch (ex) {
      setErr(ex.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold mb-6">Menu</h1>
      {err && <p className="text-ember-400 text-sm mb-4">{err}</p>}

      {/* Categories */}
      <section className="admin-card p-6 mb-8">
        <h2 className="font-semibold mb-4">Categories</h2>
        <ul className="mb-4 space-y-2">
          {categories.rows.map((c) => (
            <li key={c.id} className="flex items-center justify-between text-sm border-b border-cream/10 pb-2">
              <span>{c.name}</span>
              <button onClick={() => categories.remove(c.id)} className="text-xs text-ember-400 hover:underline">
                Delete
              </button>
            </li>
          ))}
        </ul>
        <form onSubmit={addCategory} className="flex gap-2">
          <input
            placeholder="New category name"
            value={newCategory.name}
            onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
            className="admin-input flex-1"
          />
          <button disabled={busy} className="btn-primary">Add</button>
        </form>
      </section>

      {/* Items */}
      <section className="admin-card p-6">
        <h2 className="font-semibold mb-4">Items</h2>
        <div className="space-y-3 mb-6">
          {items.rows.map((item) =>
            editingItemId === item.id ? (
              <div key={item.id} className="border border-ember-400/40 rounded-lg p-4 space-y-2">
                <input
                  value={editItem.name}
                  onChange={(e) => setEditItem({ ...editItem, name: e.target.value })}
                  className="admin-input"
                  placeholder="Name"
                />
                <textarea
                  value={editItem.description || ""}
                  onChange={(e) => setEditItem({ ...editItem, description: e.target.value })}
                  className="admin-input"
                  placeholder="Description"
                />
                <input
                  value={editItem.price}
                  onChange={(e) => setEditItem({ ...editItem, price: e.target.value })}
                  className="admin-input"
                  placeholder="Price (RF)"
                />
                <ImageUploader
                  url={editItem.image_url}
                  onUploaded={(url) => setEditItem({ ...editItem, image_url: url })}
                  onError={setErr}
                />
                <input
                  value={editItem.image_url || ""}
                  onChange={(e) => setEditItem({ ...editItem, image_url: e.target.value })}
                  className="admin-input"
                  placeholder="or paste an image URL"
                />
                <label className="flex items-center gap-2 text-sm text-cream/70">
                  <input
                    type="checkbox"
                    checked={editItem.is_available}
                    onChange={(e) => setEditItem({ ...editItem, is_available: e.target.checked })}
                  />
                  Available
                </label>
                <label className="flex items-center gap-2 text-sm text-cream/70">
                  <input
                    type="checkbox"
                    checked={!!editItem.is_specialty}
                    onChange={(e) => setEditItem({ ...editItem, is_specialty: e.target.checked })}
                  />
                  Featured on homepage
                </label>
                <div className="flex gap-2">
                  <button onClick={saveEdit} disabled={busy} className="btn-primary">Save</button>
                  <button onClick={() => setEditingItemId(null)} className="admin-btn-outline">Cancel</button>
                </div>
              </div>
            ) : (
              <div key={item.id} className="flex items-center justify-between text-sm border-b border-cream/10 pb-2">
                <div>
                  <span className="font-medium">{item.name}</span>
                  <span className="text-cream/50"> — RF {item.price} {!item.is_available && "(unavailable)"}</span>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => startEdit(item)} className="text-xs text-ember-400 hover:underline">Edit</button>
                  <button onClick={() => items.remove(item.id)} className="text-xs text-ember-400 hover:underline">Delete</button>
                </div>
              </div>
            )
          )}
        </div>

        <form onSubmit={addItem} className="space-y-2 border-t border-cream/10 pt-4">
          <p className="text-sm font-medium mb-1">Add new item</p>
          <select
            value={newItem.category_id}
            onChange={(e) => setNewItem({ ...newItem, category_id: e.target.value })}
            className="admin-input"
          >
            <option value="">Select category…</option>
            {categories.rows.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <input
            placeholder="Item name"
            value={newItem.name}
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            className="admin-input"
          />
          <textarea
            placeholder="Description"
            value={newItem.description}
            onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
            className="admin-input"
          />
          <input
            placeholder="Price (RF)"
            value={newItem.price}
            onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
            className="admin-input"
          />
          <ImageUploader
            url={newItem.image_url}
            onUploaded={(url) => setNewItem({ ...newItem, image_url: url })}
            onError={setErr}
          />
          <input
            placeholder="or paste an image URL"
            value={newItem.image_url}
            onChange={(e) => setNewItem({ ...newItem, image_url: e.target.value })}
            className="admin-input"
          />
          <label className="flex items-center gap-2 text-sm text-cream/70">
            <input
              type="checkbox"
              checked={newItem.is_specialty}
              onChange={(e) => setNewItem({ ...newItem, is_specialty: e.target.checked })}
            />
            Featured on homepage
          </label>
          <button disabled={busy} className="btn-primary">Add Item</button>
        </form>
      </section>
    </div>
  );
}
