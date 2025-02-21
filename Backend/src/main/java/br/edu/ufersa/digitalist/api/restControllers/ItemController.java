package br.edu.ufersa.digitalist.api.restControllers;

import br.edu.ufersa.digitalist.api.dto.ItemDTO;
import br.edu.ufersa.digitalist.domain.entities.Item;
import br.edu.ufersa.digitalist.domain.service.ItemService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.List;

import static br.edu.ufersa.digitalist.constant.Constant.PHOTO_DIRECTORY;
import static org.springframework.http.MediaType.IMAGE_JPEG_VALUE;
import static org.springframework.http.MediaType.IMAGE_PNG_VALUE;

@RestController
@RequestMapping("items")
@Validated
public class ItemController {

    private final ItemService itemService;

    public ItemController(ItemService itemService) {
        this.itemService = itemService;
    }

    @GetMapping
    public ResponseEntity<Page<ItemDTO>> getItems(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size) {
        Page<Item> items = itemService.getAllItems(page, size);
        Page<ItemDTO> itemDTOs = items.map(item -> new ItemDTO(
                item.getId(),
                item.getItemName(),
                item.getCategory(),
                item.getQuantity(),
                item.getDescription(),
                item.getAddedBy(),
                item.getImageUrl(),
                item.getAddedDate()
        ));
        return ResponseEntity.ok().body(itemDTOs);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ItemDTO> getItem(@PathVariable String id) {
        Item item = itemService.getItem(id);
        ItemDTO itemDTO = new ItemDTO(
                item.getId(),
                item.getItemName(),
                item.getCategory(),
                item.getQuantity(),
                item.getDescription(),
                item.getAddedBy(),
                item.getImageUrl(),
                item.getAddedDate()
        );
        return ResponseEntity.ok().body(itemDTO);
    }

    @GetMapping(path = "/image/{filename}", produces = {IMAGE_PNG_VALUE, IMAGE_JPEG_VALUE})
    public ResponseEntity<byte[]> getImage(@PathVariable String filename) {
        Path filePath = Paths.get(PHOTO_DIRECTORY + filename);
        if (!Files.exists(filePath)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(("File not found: " + filename).getBytes());
        }

        try {
            byte[] imageBytes = Files.readAllBytes(filePath);
            return ResponseEntity.ok().body(imageBytes);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(("Error reading file: " + filename).getBytes());
        }
    }

    @PostMapping
    public ResponseEntity<List<ItemDTO>> createItems(@Valid @RequestBody List<@Valid ItemDTO> itemDTOs) {
        List<Item> items = itemDTOs.stream().map(dto -> new Item(
                dto.id(),
                dto.itemName(),
                dto.category(),
                dto.quantity(),
                dto.description(),
                dto.addedBy(),
                dto.imageUrl(),
                LocalDate.now() // Set addedDate to current date
        )).toList();

        List<Item> createdItems = itemService.createItems(items);
        List<ItemDTO> createdItemDTOs = createdItems.stream().map(item -> new ItemDTO(
                item.getId(),
                item.getItemName(),
                item.getCategory(),
                item.getQuantity(),
                item.getDescription(),
                item.getAddedBy(),
                item.getImageUrl(),
                item.getAddedDate()
        )).toList();

        return ResponseEntity.status(HttpStatus.CREATED).body(createdItemDTOs);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteItem(@PathVariable String id) {
        itemService.deleteItem(id);
        return ResponseEntity.ok("Item deleted successfully.");
    }

    @PutMapping("/{id}")
    public ResponseEntity<ItemDTO> updateItem(@PathVariable String id, @Valid @RequestBody ItemDTO itemDTO) {
        Item updatedItem = itemService.updateItem(id, new Item(
                id,
                itemDTO.itemName(),
                itemDTO.category(),
                itemDTO.quantity(),
                itemDTO.description(),
                itemDTO.addedBy(),
                itemDTO.imageUrl(),
                itemDTO.addedDate()
        ));

        ItemDTO updatedItemDTO = new ItemDTO(
                updatedItem.getId(),
                updatedItem.getItemName(),
                updatedItem.getCategory(),
                updatedItem.getQuantity(),
                updatedItem.getDescription(),
                updatedItem.getAddedBy(),
                updatedItem.getImageUrl(),
                updatedItem.getAddedDate()
        );

        return ResponseEntity.ok(updatedItemDTO);
    }

    @PutMapping("/image")
    public ResponseEntity<String> uploadImage(@RequestParam("id") String id, @RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(itemService.uploadImage(id, file));
    }
}