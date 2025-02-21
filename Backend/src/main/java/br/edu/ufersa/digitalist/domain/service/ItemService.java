package br.edu.ufersa.digitalist.domain.service;

import br.edu.ufersa.digitalist.api.exceptionHandler.ResourceNotFoundException;
import br.edu.ufersa.digitalist.domain.entities.Item;
import br.edu.ufersa.digitalist.domain.repository.ItemRepository;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Optional;
import java.util.List;
import java.util.function.BiFunction;
import java.util.function.Function;

import static br.edu.ufersa.digitalist.constant.Constant.PHOTO_DIRECTORY;
import static java.nio.file.StandardCopyOption.REPLACE_EXISTING;

@Slf4j
@Service
@Transactional(rollbackOn = Exception.class)
public class ItemService {
    private final ItemRepository itemRepository;

    public ItemService(ItemRepository itemRepository) {
        this.itemRepository = itemRepository;
    }

    public Page<Item> getAllItems(int page, int size){
        return itemRepository.findAll(org.springframework.data.domain.PageRequest.of(page, size, Sort.by("itemName")));
    }

    public Item getItem(String id){
        return itemRepository.findById(id).orElseThrow(() -> new RuntimeException("Item not found"));
    }

    public List<Item> createItems(List<Item> items) {
        return itemRepository.saveAll(items);
    }

    public void deleteItem(String id) {
        Item item = itemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found with id: " + id));
        itemRepository.delete(item);
    }

    public Item updateItem(String id, Item updatedItem) {
        Item item = itemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found with id: " + id));

        if (updatedItem.getItemName() != null) item.setItemName(updatedItem.getItemName());
        if (updatedItem.getCategory() != null) item.setCategory(updatedItem.getCategory());
        if (updatedItem.getQuantity() != null) item.setQuantity(updatedItem.getQuantity());
        if (updatedItem.getDescription() != null) item.setDescription(updatedItem.getDescription());
        if (updatedItem.getAddedBy() != null) item.setAddedBy(updatedItem.getAddedBy());
        if (updatedItem.getImageUrl() != null) item.setImageUrl(updatedItem.getImageUrl());

        return itemRepository.save(item);
    }



    public String uploadImage(String id, MultipartFile file){
        Item item = getItem(id);
        String imageUrl = imageFunction.apply(id, file);
        item.setImageUrl(imageUrl);
        itemRepository.save(item);
        return imageUrl;
    }

    private final Function<String, String> fileExtension = filename -> Optional.of(filename).filter(itemName -> itemName.contains("."))
            .map(itemName -> "." + itemName.substring(filename.lastIndexOf(".") + 1)).orElse(".png");

    private final BiFunction<String, MultipartFile, String> imageFunction = (id, image) -> {
        String filename = id + fileExtension.apply(image.getOriginalFilename());
        try {
            Path fileStorageLocation = Paths.get(PHOTO_DIRECTORY).toAbsolutePath().normalize();
            if(!Files.exists(fileStorageLocation)) {
                Files.createDirectories(fileStorageLocation);
            }
            Files.copy(image.getInputStream(), fileStorageLocation.resolve(filename), REPLACE_EXISTING);

            return ServletUriComponentsBuilder
                    .fromCurrentContextPath()
                    .path("/items/image/" + filename).toUriString();
        } catch (Exception exception) {
            throw new RuntimeException("Unable to save image");
        }
    };
}
